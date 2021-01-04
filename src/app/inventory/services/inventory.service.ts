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

  private specificAmount = new Map<number, (inventory: Map<number, ItemAmount>) => Observable<number>>([
    [1, inventory => this.characterExps.getExp(inventory)],
    [2, inventory => this.weaponExps.getExp(inventory)]
  ]);

  constructor(private database: NgxIndexedDBService,
              private characterPlanner: CharacterPlanner, private weaponPlanner: WeaponPlanner,
              private characterExps: CharacterExpMaterialService, private weaponExps: WeaponExpMaterialService) {
    this.database.getAll(this.storeName).subscribe(res => {
      const inventory = new Map<number, ItemAmount>();
      res.forEach(it => inventory.set(it.id, it));
      this.#inventory.next(inventory);
    });
    combineLatest([characterPlanner.plansCost(), weaponPlanner.plansCost()])
      .subscribe(([characterCost, weaponCost]) => {
        const cost = new ItemCostList().combine(characterCost).combine(weaponCost);
        this.#cost.next(cost);
      });
  }

  getDetails(items: InventoryItem[]): Observable<InventoryItemDetail[]> {
    return combineLatest([this.inventory, this.cost]).pipe(
      switchMap(([_, cost]) => from(items).pipe(
        mergeMap(item => {
          const id = item.id;
          const isSpecific = this.specificAmount.has(id);
          return this.getHave(id, isSpecific).pipe(map(have => {
            const need = cost.get(id);
            const lack = Math.max(0, need - have);
            return {id, rarity: item.rarity, have, need, lack, overflow: lack === 0, readonly: isSpecific};
          }));
        }),
        take(items.length),
        toArray()
      ))
    );
  }

  private getHave(id: number, isSpecific: boolean): Observable<number> {
    return this.inventory.pipe(switchMap(inventory => iif(
      () => isSpecific,
      this.specificAmount?.get(id)?.(inventory),
      of(inventory.get(id)?.amount ?? 0)
    )));
  }

  setItem(id: number, amount: number): void {
    const newAmount = {id, amount};
    zip(this.inventory, this.database.update(this.storeName, newAmount)).subscribe(([inventory, _]) => {
      inventory.set(id, newAmount);
      this.#inventory.next(inventory);
    });
  }
}
