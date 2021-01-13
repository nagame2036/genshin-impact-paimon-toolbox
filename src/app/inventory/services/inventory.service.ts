import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {combineLatest, from, Observable, ReplaySubject, zip} from 'rxjs';
import {first, map, switchMap, take} from 'rxjs/operators';
import {CharacterExpMaterialService} from '../../material/services/character-exp-material.service';
import {WeaponExpMaterialService} from '../../material/services/weapon-exp-material.service';
import {InventoryItemDetail} from '../../material/models/inventory-item-detail.model';
import {InventoryItem} from '../../material/models/inventory-item.model';
import {CharacterPlanner} from '../../plan/services/character-planner.service';
import {WeaponPlanner} from '../../plan/services/weapon-planner.service';
import {ItemList} from '../../material/models/item-list.model';
import {CraftRecipe} from '../../material/models/craft-recipe.model';
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
        details.set(id, {id, rarity, need: 0, have: 0, recipe, crafted: 0, lack: 0, overflow: true, readonly: false});
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
      detail.crafted = 0;
    }
    for (const [, detail] of details) {
      const needCraft = detail.need - detail.have;
      detail.crafted += getCrafted(detail, needCraft - detail.crafted, details);
      detail.lack = Math.max(0, needCraft - detail.crafted);
      detail.overflow = detail.lack <= 0;
    }
    this.characterExps.processExpDetails(details);
    this.weaponExps.processExpDetails(details);
    return details;
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
        })
      )
      .subscribe();
  }

  setItem(id: number, amount: number): void {
    zip(this.#inventory, this.database.update(this.storeName, {id, amount})).subscribe(([inventory, _]) => {
      inventory.setAmount(id, amount);
      this.#inventory.next(inventory);
    });
  }

  craft(detail: InventoryItemDetail, craftNeed: number): void {
    combineLatest([this.details, this.#inventory])
      .pipe(
        first(),
        switchMap(([details, inventory]) => {
          const change = this.craftItem(detail, craftNeed, details).change(detail.id, craftNeed);
          inventory.combine(change);
          this.#inventory.next(inventory);
          const changeEntries = change.entries();
          return from(changeEntries).pipe(
            take(changeEntries.length),
            map(([id, _]) => [id, inventory.getAmount(id)]),
            switchMap(([id, amount]) => this.database.update(this.storeName, {id, amount}))
          );
        })
      )
      .subscribe();
  }

  private craftItem(detail: InventoryItemDetail, craftNeed: number, details: Map<number, InventoryItemDetail>): ItemList {
    const change = new ItemList();
    if (craftNeed <= 0) {
      return change;
    }
    if (!detail.recipe) {
      return change;
    }
    for (const [item, amount] of getRecipe(detail.recipe, details)) {
      const itemCraftNeed = amount * craftNeed;
      const have = item.have;
      if (have >= itemCraftNeed) {
        change.change(item.id, -itemCraftNeed);
        continue;
      }
      change.change(item.id, -have);
      const remainingCraftNeed = itemCraftNeed - have;
      change.combine(this.craftItem(item, remainingCraftNeed, details));
    }
    return change;
  }
}

function getRecipe(recipe: CraftRecipe, details: Map<number, InventoryItemDetail>): [InventoryItemDetail, number][] {
  return mapArrays(Object.entries(recipe), details, it => Number(it[0]), (it, detail) => [detail, it[1]]);
}

function getCrafted(detail: InventoryItemDetail, needCraft: number, details: Map<number, InventoryItemDetail>): number {
  if (needCraft <= 0) {
    return 0;
  }
  if (!detail.recipe) {
    return 0;
  }
  let canCrafted = -1;
  for (const [item, amount] of getRecipe(detail.recipe, details)) {
    const itemNeedCraft = needCraft * amount - item.have - item.crafted;
    const itemCrafted = getCrafted(item, itemNeedCraft, details);
    const remaining = item.have + itemCrafted;
    if (remaining <= 0) {
      return 0;
    }
    const crafted = Math.floor(remaining / amount);
    if (canCrafted === -1 || crafted < canCrafted) {
      canCrafted = crafted;
    }
  }
  return Math.min(canCrafted, needCraft);
}
