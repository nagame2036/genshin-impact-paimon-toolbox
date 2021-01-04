import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {combineLatest, from, iif, Observable, of, ReplaySubject, zip} from 'rxjs';
import {map, mergeMap, switchMap, take, toArray} from 'rxjs/operators';
import {ItemAmount} from '../../material/models/item-amount.model';
import {CharacterExpMaterialService} from '../../material/services/character-exp-material.service';
import {WeaponExpMaterialService} from '../../material/services/weapon-exp-material.service';
import {InventoryItemDetail} from '../models/inventory-item-detail.model';
import {InventoryItem} from '../../material/models/inventory-item.model';
import {CharacterPlanner} from '../../plan/services/character-planner.service';
import {WeaponPlanner} from '../../plan/services/weapon-planner.service';
import {ItemCostList} from '../../plan/models/item-cost-list.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private readonly storeName = 'materials';

  #inventory = new ReplaySubject<Map<number, ItemAmount>>(1);

  readonly inventory = this.#inventory.asObservable();

  #cost = new ReplaySubject<ItemCostList>(1);

  readonly cost = this.#cost.asObservable();

  private readonly specificHave = new Map<number, (inventory: Map<number, ItemAmount>) => Observable<number>>([
    [1, inventory => this.characterExps.getExp(inventory)],
    [2, inventory => this.weaponExps.getExp(inventory)]
  ]);

  private readonly overflowChecker =
    new Map<number, (inventory: Map<number, ItemAmount>, cost: ItemCostList, lack: number) => Observable<boolean>>([
      [100, (inventory, cost, lack) => this.characterExps.expHasOverflow(inventory, cost, lack)],
      [101, (inventory, cost, lack) => this.characterExps.expHasOverflow(inventory, cost, lack)],
      [102, (inventory, cost, lack) => this.characterExps.expHasOverflow(inventory, cost, lack)],
      [200, (inventory, cost, lack) => this.weaponExps.expHasOverflow(inventory, cost, lack)],
      [201, (inventory, cost, lack) => this.weaponExps.expHasOverflow(inventory, cost, lack)],
      [202, (inventory, cost, lack) => this.weaponExps.expHasOverflow(inventory, cost, lack)]
    ]);

  constructor(private database: NgxIndexedDBService,
              private characterPlanner: CharacterPlanner, private weaponPlanner: WeaponPlanner,
              private characterExps: CharacterExpMaterialService, private weaponExps: WeaponExpMaterialService) {
    this.database.getAll(this.storeName).subscribe(res => {
      const inventory = new Map<number, ItemAmount>();
      res.forEach(it => inventory.set(it.id, it));
      this.#inventory.next(inventory);
    });
    combineLatest([this.inventory, characterPlanner.plansCost(), weaponPlanner.plansCost()])
      .pipe(switchMap(([inventory, characterCost, weaponCost]) => {
        const cost = new ItemCostList().combine(characterCost).combine(weaponCost);
        return this.characterExps.divideExpMaterials(inventory, cost)
          .pipe(switchMap(res => this.weaponExps.divideExpMaterials(inventory, res)));
      }))
      .subscribe(cost => this.#cost.next(cost));
  }

  getDetails(items: InventoryItem[]): Observable<InventoryItemDetail[]> {
    return this.cost.pipe(
      switchMap(cost => from(items).pipe(
        mergeMap(item => this.getDetail(item, cost)),
        take(items.length),
        toArray()
      ))
    );
  }

  private getDetail(item: InventoryItem, cost: ItemCostList): Observable<InventoryItemDetail> {
    const id = item.id;
    const isSpecific = this.specificHave.has(id);
    return this.inventory.pipe(
      switchMap(inventory => {
        const haveObservable = iif(
          () => isSpecific,
          this.specificHave?.get(id)?.(inventory),
          of(inventory.get(id)?.amount ?? 0)
        );
        return haveObservable.pipe(switchMap(have => {
          const need = cost.get(id);
          const lack = Math.max(0, need - have);
          return this.checkOverflow(item, lack, inventory, cost).pipe(map(overflow => {
            return {id, rarity: item.rarity, have, need, lack, overflow, readonly: isSpecific};
          }));
        }));
      })
    );
  }

  private checkOverflow(item: InventoryItem, lack: number, inventory: Map<number, ItemAmount>, cost: ItemCostList): Observable<boolean> {
    const id = item.id;
    const defaultResult = of(lack === 0);
    return this.overflowChecker.has(id) ? this.overflowChecker?.get(id)?.(inventory, cost, lack) ?? defaultResult : defaultResult;
  }

  setItem(id: number, amount: number): void {
    const newAmount = {id, amount};
    zip(this.inventory, this.database.update(this.storeName, newAmount)).subscribe(([inventory, _]) => {
      inventory.set(id, newAmount);
      this.#inventory.next(inventory);
    });
  }
}
