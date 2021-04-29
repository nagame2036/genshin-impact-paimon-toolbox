import {Injectable} from '@angular/core';
import {MaterialInfoService} from './material-info.service';
import {MaterialQuantityService} from './material-quantity.service';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {MaterialRequirementService} from './material-requirement.service';
import {NGXLogger} from 'ngx-logger';
import {MaterialDetail} from '../models/material.model';
import {MaterialCraftService} from './material-craft.service';
import {map} from 'rxjs/operators';
import {MaterialList} from '../collections/material-list';
import {MaterialRequireList} from '../collections/material-require-list';
import {ItemType} from '../../game-common/models/item-type.type';
import {MaterialType} from '../models/material-type.enum';
import {MaterialRequireMark} from '../models/material-require-mark.model';
import {RequireDetail} from '../models/requirement-detail.model';
import {Item} from '../../game-common/models/item.model';
import {CraftDetail, CraftRecipe} from '../models/craft.type';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  readonly materials = new Map<number, MaterialDetail>();

  readonly typed = new Map<MaterialType, Map<number, MaterialDetail>>();

  readonly grouped = new Map<number, MaterialDetail[]>();

  private updated$ = new ReplaySubject(1);

  readonly updated = this.updated$.asObservable();

  constructor(
    private infos: MaterialInfoService,
    private quantities: MaterialQuantityService,
    private requirements: MaterialRequirementService,
    private crafter: MaterialCraftService,
    private logger: NGXLogger,
  ) {
    this.initDetails();
    this.updateDetails();
  }

  getRequireMaterials(ids: number[], order: MaterialType[]): MaterialDetail[] {
    const result = [];
    for (const id of new Set(ids)) {
      const group = this.grouped.get(id);
      if (!group) {
        const material = this.materials.get(id);
        if (material) {
          result.push(material);
        }
        continue;
      }
      let max: MaterialDetail = group[0];
      for (const m of group) {
        if (m.info.rarity > max.info.rarity) {
          max = m;
        }
      }
      result.push(max);
    }
    return result.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));
  }

  getRequireDetails(type: ItemType, key: number, purposes: string[]): Observable<RequireDetail[]> {
    return this.updated.pipe(
      map(_ => this.requirements.getType(type).getDetails(key, purposes, this.materials)),
    );
  }

  getRequireMarks(id: number): MaterialRequireMark[] {
    return this.requirements.getMarks(id);
  }

  getCraftDetails(item: MaterialDetail): Observable<CraftDetail[]> {
    return this.updated.pipe(map(_ => this.crafter.getCraftDetails(item, this.materials)));
  }

  updateHave(id: number, have: number): void {
    this.quantities.update(id, have);
  }

  updateRequire(type: ItemType, key: number, req: MaterialRequireList[]): void {
    this.requirements.update(type, key, req);
  }

  consumeRequire(requirement: MaterialDetail[]): void {
    const cost = new MaterialList();
    requirement.forEach(({info, need}) => cost.setAmount(info.id, -need));
    this.quantities.change(cost);
  }

  craft(id: number, recipe: CraftRecipe, performedTimes: number): void {
    const change = this.crafter.craft(id, recipe, performedTimes);
    this.logger.info('craft material', id, change);
    this.quantities.change(change);
  }

  removeAllRequire(type: ItemType, items: Item<any>[]): void {
    this.requirements.removeAll(type, items);
  }

  private initDetails(): void {
    for (const [type, infos] of this.infos.typed) {
      const materials = new Map<MaterialType, MaterialDetail>();
      for (const info of infos) {
        const {id, group} = info;
        const material = new MaterialDetail(type, info);
        this.materials.set(id, material);
        materials.set(id, material);
        if (group && !this.infos.ignoredGroupTypes.includes(type)) {
          const grouped = this.grouped.get(group) ?? [];
          grouped.push(material);
          this.grouped.set(group, grouped);
        }
      }
      this.typed.set(type, materials);
    }
  }

  private updateDetails(): void {
    combineLatest([this.quantities.changes, this.requirements.changes]).subscribe(
      ([quantities, requirements]) => {
        for (const [id, have] of quantities.entries()) {
          this.materials.get(id)?.updateHave(have);
        }
        for (const [id, need] of requirements.entries()) {
          this.materials.get(id)?.updateNeed(need);
        }
        for (const material of this.materials.values()) {
          material.craftable = this.crafter.isCraftable(material, this.materials);
        }
        this.infos.processSpecialMaterials(this.materials);
        this.logger.info('updated materials', this.materials);
        this.updated$.next();
      },
    );
  }
}
