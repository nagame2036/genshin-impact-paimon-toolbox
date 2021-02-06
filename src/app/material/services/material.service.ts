import {Injectable} from '@angular/core';
import {MaterialInformationService} from './material-information.service';
import {MaterialQuantityService} from './material-quantity.service';
import {BehaviorSubject, combineLatest, Observable, ReplaySubject} from 'rxjs';
import {MaterialRequirementService} from './material-requirement.service';
import {NGXLogger} from 'ngx-logger';
import {allRarities} from '../../game-common/models/rarity.type';
import {MaterialDetail} from '../models/material.model';
import {MaterialCraftService} from './material-craft.service';
import {first, map, switchMap, tap} from 'rxjs/operators';
import {mapArrays} from '../../shared/utils/collections';
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

  craft(target: MaterialDetail, performedTimes: number): void {
    this.materials$
      .pipe(
        first(),
        map(materials => this.crafter.craft(target, performedTimes, materials, new MaterialList())),
        tap(change => this.logger.info('craft material', target, change))
      )
      .subscribe(change => this.quantities.change(change));
  }

  private updateMaterials(): void {
    combineLatest([this.information.getAll(), this.quantities.quantities, this.requirements.getAll()])
      .subscribe(([information, quantities, requirements]) => {
        const materials = new Map<number, MaterialDetail>(information.map(info => {
          const id = info.id;
          const material = new MaterialDetail(info);
          material.have = quantities.getAmount(id);
          material.need = requirements.getNeed(id);
          return [id, material];
        }));
        for (const material of materials.values()) {
          const lack = material.need - material.have - material.craftable;
          material.craftable += this.crafter.getCraftableAmount(material, lack, materials);
          material.lack = Math.max(0, lack - material.craftable);
          material.overflow = material.lack <= 0;
        }
        this.information.processSpecialMaterials(materials);
        this.logger.info('updated materials', materials);
        this.materials$.next(materials);
      });
  }
}
