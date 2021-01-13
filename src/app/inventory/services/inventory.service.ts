import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {combineLatest, from, Observable, ReplaySubject, zip} from 'rxjs';
import {concatMap, first, map, reduce, switchMap, take} from 'rxjs/operators';
import {CharacterExpMaterialService} from '../../material/services/character-exp-material.service';
import {WeaponExpMaterialService} from '../../material/services/weapon-exp-material.service';
import {InventoryItemDetail} from '../../material/models/inventory-item-detail.model';
import {InventoryItem} from '../../material/models/inventory-item.model';
import {CharacterPlanner} from '../../plan/services/character-planner.service';
import {WeaponPlanner} from '../../plan/services/weapon-planner.service';
import {ItemList} from '../../material/models/item-list.model';
import {craftItem, getCraftableAmount} from '../utils/craft';
import {MaterialService} from '../../material/services/material.service';
import {mapArrays} from '../../shared/utils/collections';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private readonly storeName = 'materials';

  #inventory = new ReplaySubject<ItemList>(1);

  #cost = new ReplaySubject<ItemList>(1);

  #details = new ReplaySubject<Map<number, InventoryItemDetail>>(1);

  readonly details = this.#details.asObservable();

  constructor(private database: NgxIndexedDBService, private characterPlanner: CharacterPlanner, private weaponPlanner: WeaponPlanner,
              private characterExps: CharacterExpMaterialService, private weaponExps: WeaponExpMaterialService,
              private materials: MaterialService) {
    this.loadDatabase();
    this.loadMaterials();
    this.calculateNeed();
    this.calculateDetails();
  }

  getDetails(items: InventoryItem[]): Observable<InventoryItemDetail[]> {
    return this.details.pipe(map(details => mapArrays(items, details, it => it.id, (_, detail) => detail)));
  }

  changeItem(id: number, change: number): void {
    this.#inventory
      .pipe(first(), map(inventory => {
        const amount = inventory.getAmount(id) + change;
        return this.database.update(this.storeName, {id, amount}).pipe(map(_ => {
          inventory.change(id, change);
          this.#inventory.next(inventory);
        }));
      }))
      .subscribe();
  }

  setItem(id: number, amount: number): void {
    zip(this.#inventory, this.updateDatabaseInventory(id, amount)).subscribe(([inventory, _]) => {
      inventory.setAmount(id, amount);
      this.#inventory.next(inventory);
    });
  }

  craftItem(detail: InventoryItemDetail, performedTimes: number): void {
    combineLatest([this.details, this.#inventory])
      .pipe(
        first(),
        switchMap(([details, inventory]) => {
          const change = craftItem(detail, performedTimes, details);
          inventory.combine(change);
          const changeEntries = change.entries();
          return from(changeEntries).pipe(
            take(changeEntries.length),
            concatMap(([id]) => this.updateDatabaseInventory(id, inventory.getAmount(id))),
            reduce((acc, _) => acc, inventory)
          );
        })
      )
      .subscribe(inventory => this.#inventory.next(inventory));
  }

  private loadDatabase(): void {
    this.database.getAll(this.storeName).subscribe(res => {
      const inventory = new ItemList();
      res.forEach(it => inventory.change(it.id, it.amount));
      this.#inventory.next(inventory);
    });
  }

  private loadMaterials(): void {
    this.materials.materials.subscribe(materials => {
      const details = new Map<number, InventoryItemDetail>();
      for (const {id, rarity, recipe} of materials) {
        details.set(id, {id, rarity, need: 0, have: 0, recipe, craftable: 0, craftUsed: 0, lack: 0, overflow: true, readonly: false});
      }
      this.#details.next(details);
    });
  }

  private calculateNeed(): void {
    combineLatest([this.characterPlanner.plansCost(), this.weaponPlanner.plansCost()])
      .subscribe(([characterCost, weaponCost]) => {
        const cost = new ItemList().combine(characterCost).combine(weaponCost);
        this.#cost.next(cost);
      });
  }

  private calculateDetails(): void {
    combineLatest([this.#inventory, this.#cost])
      .pipe(switchMap(([inventory, cost]) =>
        this.details.pipe(
          first(),
          map(details => this.updateDetails(details, inventory, cost))
        )
      ))
      .subscribe(details => this.#details.next(details));
  }

  private updateDetails(details: Map<number, InventoryItemDetail>, inventory: ItemList, cost: ItemList): Map<number, InventoryItemDetail> {
    for (const [id, detail] of details) {
      detail.have = inventory.getAmount(id);
      detail.need = cost.getAmount(id);
      detail.craftable = 0;
      detail.craftUsed = 0;
    }
    for (const [, detail] of details) {
      const lack = detail.need - detail.have - detail.craftable;
      detail.craftable += getCraftableAmount(detail, lack, details);
      detail.lack = Math.max(0, lack - detail.craftable);
      detail.overflow = detail.lack <= 0;
    }
    this.characterExps.processExpDetails(details);
    this.weaponExps.processExpDetails(details);
    return details;
  }

  private updateDatabaseInventory(id: number, amount: number): Observable<any[]> {
    return this.database.update(this.storeName, {id, amount});
  }
}
