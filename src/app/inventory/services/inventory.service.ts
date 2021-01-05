import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {combineLatest, Observable, ReplaySubject, zip} from 'rxjs';
import {map, switchMap, take} from 'rxjs/operators';
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
import {CraftRecipe} from '../../material/models/craft-recipe.model';
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

  #recipes = new ReplaySubject<Map<number, CraftRecipe>>(1);

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
      res.forEach(it => inventory.add(it.id, it.amount));
      this.#inventory.next(inventory);
    });
  }

  private loadMaterials(): void {
    combineLatest([this.characterExps.items, this.weaponExps.items, this.elemental.items, this.talents.items, this.weapons.items,
      this.common.items, this.ores.items, this.local.items]).subscribe(materials => {
      const recipes = new Map<number, CraftRecipe>();
      const details = new Map<number, InventoryItemDetail>();
      for (const items of [[mora], [characterExp], [weaponExp], ...materials]) {
        for (const {id, rarity, recipe} of items) {
          details.set(id, {id, rarity, need: 0, have: 0, crafted: 0, craftUsed: 0, lack: 0, overflow: true, readonly: false});
          if (recipe) {
            recipes.set(id, recipe);
          }
        }
      }
      this.#recipes.next(recipes);
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
    combineLatest([this.#inventory, this.#cost, this.#recipes])
      .pipe(switchMap(([inventory, cost, recipes]) =>
        this.details.pipe(
          take(1),
          map(details => this.updateDetails(details, inventory, cost, recipes))
        )
      ))
      .subscribe(details => this.#details.next(details));
  }

  private updateDetails(details: Map<number, InventoryItemDetail>, inventory: ItemList, cost: ItemList,
                        recipes: Map<number, CraftRecipe>): Map<number, InventoryItemDetail> {
    for (const [id, detail] of details) {
      detail.have = inventory.getAmount(id);
      detail.need = cost.getAmount(id);
      detail.crafted = 0;
      detail.craftUsed = 0;
    }
    this.characterExps.calculateExpNeed(details);
    this.weaponExps.calculateExpNeed(details);
    for (const [id, detail] of details) {
      const needCraft = detail.need - detail.have - detail.crafted;
      const recipe = recipes.get(id);
      if (recipe) {
        detail.crafted += getCrafted(detail.id, needCraft, details, recipes);
      }
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
}

function getCrafted(id: number, needCraft: number, details: Map<number, InventoryItemDetail>, recipes: Map<number, CraftRecipe>): number {
  if (needCraft <= 0) {
    return 0;
  }
  const recipe = recipes.get(id);
  if (!recipe) {
    return 0;
  }
  let canCrafted = -1;
  const craftRecipe = Object.entries(recipe).filter(([itemId, _]) => itemId !== '0')
    .map(([itemId, amount]) => [details.get(Number(itemId)), amount]);
  for (const [item, amount] of craftRecipe) {
    if (!item) {
      continue;
    }
    const itemNeedCraft = needCraft * amount + item.need - item.have - item.crafted;
    item.crafted += getCrafted(item.id, itemNeedCraft, details, recipes);
    const remaining = item.have + item.crafted - item.need - item.craftUsed;
    if (remaining <= 0) {
      return 0;
    }
    const crafted = Math.floor(remaining / amount);
    if (canCrafted === -1 || crafted < canCrafted) {
      canCrafted = crafted;
    }
  }
  canCrafted = Math.min(canCrafted, needCraft);
  for (const [item, amount] of craftRecipe) {
    if (item) {
      item.craftUsed += amount * canCrafted;
    }
  }
  return canCrafted;
}
