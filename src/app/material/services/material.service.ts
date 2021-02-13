import {Injectable} from '@angular/core';
import {MaterialInformationService} from './material-information.service';
import {MaterialQuantityService} from './material-quantity.service';
import {BehaviorSubject, combineLatest, Observable, ReplaySubject} from 'rxjs';
import {MaterialRequirementService} from './material-requirement.service';
import {NGXLogger} from 'ngx-logger';
import {allRarities} from '../../game-common/models/rarity.type';
import {CraftRecipe, MaterialDetail} from '../models/material.model';
import {MaterialCraftService} from './material-craft.service';
import {map, switchMap, tap} from 'rxjs/operators';
import {MaterialList} from '../models/material-list.model';
import {MaterialRequireList} from '../models/material-require-list.model';
import {ItemType, itemTypeNames} from '../../game-common/models/item-type.enum';
import {MaterialType} from '../models/material-type.enum';
import {MaterialRequireMark} from '../models/material-require-mark.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private materials$ = new ReplaySubject<Map<number, MaterialDetail>>(1);

  readonly rarityOptions = allRarities.map(it => ({value: it, text: `★${it}`}));

  rarityFilter = new BehaviorSubject(allRarities);

  showOverflow = new BehaviorSubject(true);

  constructor(private information: MaterialInformationService, private quantities: MaterialQuantityService,
              private requirements: MaterialRequirementService, private crafter: MaterialCraftService, private logger: NGXLogger) {
    this.updateMaterials();
  }

  getRequireMarks(id: number): Observable<MaterialRequireMark[]> {
    return this.requirements.getMarks(id);
  }

  getRequirements(type: ItemType, key: number, purposes: string[]): Observable<{ text: string, value: MaterialList, satisfied: boolean }> {
    return this.requirements.getType(type).pipe(switchMap(requirements => {
      const cost = new MaterialList(purposes.map(purpose => requirements.getNeedByKeyAndPurpose(key, purpose)));
      return this.materials$.pipe(map(materials => {
        const satisfied = cost.entries().every(([id, need]) => need <= (materials.get(id)?.have ?? 0));
        const result = {text: purposes[0], value: cost, satisfied};
        this.logger.info(`sent ${itemTypeNames[type]} ${key} requirement by ${purposes[0]}`, cost, satisfied);
        return result;
      }));
    }));
  }

  getAll(ids: number[]): Observable<MaterialDetail[]> {
    return this.materials$.pipe(
      map(materials => mapArrays(ids, materials, id => id, (_, material) => material)),
      tap(materials => this.logger.info('sent materials', materials)),
    );
  }

  getTypes(...types: MaterialType[]): Observable<MaterialDetail[]> {
    return combineLatest([this.materials$, this.rarityFilter, this.showOverflow]).pipe(
      switchMap(([materials, rarities, showOverflow]) => {
        return this.information.getTypes(...types).pipe(map(infos => {
          return mapArrays(infos, materials, it => it.id, (_, material) => material)
            .filter(({rarity, overflow}) => rarities.includes(rarity) && (!overflow || showOverflow));
        }));
      }),
      tap(materials => this.logger.info('sent materials', materials)),
    );
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

  consumeRequire(requirement: MaterialList): void {
    const cost = new MaterialList();
    requirement.entries().forEach(([id, need]) => cost.setAmount(id, -need));
    this.quantities.change(cost);
  }

  craft(id: number, recipe: CraftRecipe, performedTimes: number): void {
    const change = this.crafter.craft(id, recipe, performedTimes);
    this.logger.info('craft material', id, change);
    this.quantities.change(change);
  }

  private updateMaterials(): void {
    combineLatest([this.information.getAll(), this.quantities.quantities, this.requirements.getAll()])
      .subscribe(([information, quantities, requirements]) => {
        const materials = new Map<number, MaterialDetail>(information.map(info => {
          const id = info.id;
          const material = new MaterialDetail(info);
          material.have = quantities.getAmount(id);
          material.need = requirements.getNeed(id);
          material.lack = Math.max(0, material.need - material.have);
          material.overflow = material.lack <= 0;
          return [id, material];
        }));
        for (const material of materials.values()) {
          material.craftable = this.crafter.isCraftable(material, materials);
        }
        this.information.processSpecialMaterials(materials);
        this.logger.info('updated materials', materials);
        this.materials$.next(materials);
      });
  }
}

function mapArrays<T, K, V, R>(items: T[], itemMap: Map<K, V>, key: (item: T) => K, result: (item: T, mapItem: V) => R): R[] {
  const results = [];
  for (const item of items) {
    const mapItem = itemMap.get(key(item));
    if (mapItem) {
      results.push(result(item, mapItem));
    }
  }
  return results;
}
