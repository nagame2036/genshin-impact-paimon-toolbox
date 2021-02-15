import {Injectable} from '@angular/core';
import {MaterialInfoService} from './material-info.service';
import {MaterialQuantityService} from './material-quantity.service';
import {BehaviorSubject, combineLatest, Observable, ReplaySubject} from 'rxjs';
import {MaterialRequirementService} from './material-requirement.service';
import {NGXLogger} from 'ngx-logger';
import {allRarities} from '../../game-common/models/rarity.type';
import {CraftRecipe, MaterialDetail} from '../models/material.model';
import {MaterialCraftService} from './material-craft.service';
import {map, switchMap, tap} from 'rxjs/operators';
import {MaterialList} from '../collections/material-list';
import {MaterialRequireList} from '../collections/material-require-list';
import {ItemType} from '../../game-common/models/item-type.enum';
import {MaterialType} from '../models/material-type.enum';
import {MaterialRequireMark} from '../models/material-require-mark.model';
import {RequirementDetail} from '../models/requirement-detail.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private readonly materials$ = new BehaviorSubject(new Map<number, MaterialDetail>());

  private readonly filtered$ = new ReplaySubject<Map<number, MaterialDetail[]>>(1);

  readonly filtered = this.filtered$.asObservable();

  readonly rarityOptions = allRarities.map(it => ({value: it, text: `★${it}`}));

  rarityFilter = new BehaviorSubject(allRarities);

  showOverflow = new BehaviorSubject(true);

  constructor(private infos: MaterialInfoService, private quantities: MaterialQuantityService,
              private requirements: MaterialRequirementService, private crafter: MaterialCraftService, private logger: NGXLogger) {
    this.updateMaterials();
  }

  getRequirements(type: ItemType, key: number): Observable<RequirementDetail[]> {
    return this.requirements.getType(type).pipe(switchMap(requirements => {
      return this.materials$.pipe(map(materials => requirements.getDetails(key, materials)));
    }));
  }

  getRequireMarks(id: number): Observable<MaterialRequireMark[]> {
    return this.requirements.getMarks(id);
  }

  getCraftDetails(item: MaterialDetail): Observable<{ usage: MaterialDetail[], craftableAmount: number }[]> {
    return this.materials$.pipe(
      map(materials => this.crafter.getCraftDetails(item, materials)),
      tap(details => this.logger.info('sent material craft details', item, details)),
    );
  }

  updateHave(id: number, have: number): void {
    this.quantities.update(id, have);
  }

  updateRequirement(type: ItemType, requirement: MaterialRequireList): void {
    this.requirements.update(type, requirement);
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

  private updateMaterials(): void {
    combineLatest([this.infos.getAll(), this.quantities.quantities, this.requirements.getAll(), this.rarityFilter, this.showOverflow])
      .subscribe(([information, quantities, requirements, rarities, showOverflow]) => {
        const materials = this.materials$.getValue();
        for (const [type, infos] of information) {
          for (const info of infos) {
            const id = info.id;
            const have = quantities.getAmount(id);
            const need = requirements.getNeed(id);
            const material = materials.get(id);
            if (material) {
              material.update(have, need);
            } else {
              materials.set(id, new MaterialDetail(type, info, have, need));
            }
          }
        }
        for (const material of materials.values()) {
          material.craftable = this.crafter.isCraftable(material, materials);
        }
        this.infos.processSpecialMaterials(materials);
        this.logger.info('updated materials', materials);
        this.materials$.next(materials);

        const filtered = new Map<MaterialType, MaterialDetail[]>();
        for (const material of materials.values()) {
          const {type, info, overflow} = material;
          if ((!overflow || showOverflow) && rarities.includes(info.rarity)) {
            const typedMaterials = filtered.get(type) ?? [];
            typedMaterials.push(material);
            filtered.set(type, typedMaterials);
          }
        }
        this.logger.info('filtered materials', filtered);
        this.filtered$.next(filtered);
      });
  }
}
