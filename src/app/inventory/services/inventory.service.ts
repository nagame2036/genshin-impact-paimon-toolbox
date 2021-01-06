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
import {CommonMaterialService} from '../../material/services/common-material.service';
import {ElementalMaterialService} from '../../material/services/elemental-material.service';
import {TalentMaterialService} from '../../material/services/talent-material.service';
import {WeaponMaterialService} from '../../material/services/weapon-material.service';
import {OreMaterialService} from '../../material/services/ore-material.service';
import {LocalSpecialtyService} from '../../material/services/local-specialty.service';
import {characterExp, mora, weaponExp} from '../../material/models/mora-and-exp.model';

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
              private elemental: ElementalMaterialService, private talents: TalentMaterialService,
              private weapons: WeaponMaterialService, private common: CommonMaterialService, private ores: OreMaterialService,
              private local: LocalSpecialtyService) {
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
    combineLatest([this.characterExps.items, this.weaponExps.items, this.elemental.items, this.talents.items, this.weapons.items,
      this.common.items, this.ores.items, this.local.items]).subscribe(materials => {
      const details = new Map<number, InventoryItemDetail>();
      for (const items of [[mora], [characterExp], [weaponExp], ...materials]) {
        for (const {id, rarity, recipe} of items) {
          details.set(id, {id, rarity, need: 0, have: 0, recipe, crafted: 0, lack: 0, overflow: true, readonly: false});
        }
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
    this.characterExps.calculateExpNeed(details);
    this.weaponExps.calculateExpNeed(details);
    for (const [id, detail] of details) {
      const needCraft = detail.need - detail.have;
      detail.crafted += getCrafted(id, needCraft - detail.crafted, details);
      detail.lack = Math.max(0, needCraft - detail.crafted);
      detail.overflow = detail.lack <= 0;
    }
    this.characterExps.processExpDetails(details);
    this.weaponExps.processExpDetails(details);
    return details;
  }

  getDetails(items: InventoryItem[]): Observable<InventoryItemDetail[]> {
    return this.details.pipe(map(details => {
      const results: InventoryItemDetail[] = [];
      for (const {id} of items) {
        const detail = details.get(id);
        if (detail) {
          results.push(detail);
        }
      }
      return results;
    }));
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
    const recipe = detail.recipe;
    if (!recipe) {
      return change;
    }
    const craftRecipe = Object.entries(recipe).map(([itemId, amount]) => [details.get(Number(itemId)), amount]);
    for (const [item, amount] of craftRecipe) {
      if (!item) {
        continue;
      }
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

function getCrafted(id: number, needCraft: number, details: Map<number, InventoryItemDetail>): number {
  if (needCraft <= 0) {
    return 0;
  }
  const recipe = details.get(id)?.recipe;
  if (!recipe) {
    return 0;
  }
  let canCrafted = -1;
  const craftRecipe = Object.entries(recipe).map(([itemId, amount]) => [details.get(Number(itemId)), amount]);
  for (const [item, amount] of craftRecipe) {
    if (!item) {
      continue;
    }
    const itemNeedCraft = needCraft * amount - item.have - item.crafted;
    const itemCrafted = getCrafted(item.id, itemNeedCraft, details);
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
