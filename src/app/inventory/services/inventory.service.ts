import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {BehaviorSubject, combineLatest, from, Observable, ReplaySubject, zip} from 'rxjs';
import {concatMap, first, map, reduce, switchMap, take, tap} from 'rxjs/operators';
import {InventoryItemDetail} from '../models/inventory-item-detail.model';
import {InventoryItem} from '../models/inventory-item.model';
import {CharacterPlanner} from '../../character/services/character-planner.service';
import {WeaponPlanner} from '../../weapon/services/weapon-planner.service';
import {ItemList} from '../models/item-list.model';
import {craftItem, getCraftableAmount} from '../utils/craft';
import {MaterialService} from './material.service';
import {mapArrays} from '../../shared/utils/collections';
import {NGXLogger} from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private readonly storeName = 'materials';

  #inventory = new ReplaySubject<ItemList>(1);

  #cost = new ReplaySubject<ItemList>(1);

  #details = new ReplaySubject<Map<number, InventoryItemDetail>>(1);

  readonly details = this.#details.asObservable();

  readonly rarities = [5, 4, 3, 2, 1].map(it => ({value: it, text: `★${it}`}));

  rarityFilter = new BehaviorSubject(this.rarities.map(it => it.value));

  showOverflow = new BehaviorSubject(true);

  constructor(private database: NgxIndexedDBService, private characterPlanner: CharacterPlanner, private weaponPlanner: WeaponPlanner,
              private materials: MaterialService, private logger: NGXLogger) {
    this.loadDatabase();
    this.loadMaterials();
    this.updateNeed();
    this.updateDetails();
  }

  isShowOverflow(): Observable<boolean> {
    return this.showOverflow.asObservable();
  }

  setShowOverflow(value: boolean): void {
    this.logger.info('set show overflow', value);
    this.showOverflow.next(value);
  }

  setRarityFilter(rarityFilter: number[]): void {
    this.logger.info('set rarity filter', rarityFilter);
    this.rarityFilter.next(rarityFilter);
  }

  getDetails(items: InventoryItem[]): Observable<InventoryItemDetail[]> {
    return combineLatest([this.details, this.rarityFilter, this.showOverflow]).pipe(
      map(([details, rarityFilter, showOverflow]) => {
        const itemDetails = mapArrays(items, details, it => it.id, (_, detail) => detail);
        return itemDetails.filter(it => rarityFilter.includes(it.rarity) && (!it.overflow || showOverflow));
      }),
      tap(details => this.logger.info('sent inventory details', details)),
    );
  }

  changeItem(id: number, change: number): void {
    this.#inventory
      .pipe(first(), map(inventory => {
        const amount = inventory.getAmount(id) + change;
        return this.database.update(this.storeName, {id, amount}).pipe(map(_ => {
          this.logger.info('change item have', id, change);
          inventory.change(id, change);
          this.#inventory.next(inventory);
        }));
      }))
      .subscribe();
  }

  setItem(id: number, amount: number): void {
    zip(this.#inventory, this.updateDatabaseInventory(id, amount)).subscribe(([inventory, _]) => {
      this.logger.info('set item have', id, amount);
      inventory.setAmount(id, amount);
      this.#inventory.next(inventory);
    });
  }

  craftItem(detail: InventoryItemDetail, performedTimes: number): void {
    combineLatest([this.details, this.#inventory])
      .pipe(
        first(),
        switchMap(([details, inventory]) => {
          this.logger.info('craft item', performedTimes, detail);
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
    this.database.getAll(this.storeName).subscribe(data => {
      this.logger.info('fetched inventory data from indexed db', data);
      const inventory = new ItemList();
      data.forEach(it => inventory.change(it.id, it.amount));
      this.#inventory.next(inventory);
    });
  }

  private loadMaterials(): void {
    this.materials.materials.subscribe(materials => {
      this.logger.info('received materials', materials);
      const details = new Map<number, InventoryItemDetail>();
      for (const {id, rarity, recipe} of materials) {
        details.set(id, {id, rarity, need: 0, have: 0, recipe, craftable: 0, craftUsed: 0, lack: 0, overflow: true, readonly: false});
      }
      this.#details.next(details);
    });
  }

  private updateNeed(): void {
    combineLatest([this.characterPlanner.allPlansCost(), this.weaponPlanner.allPlansCost()])
      .subscribe(([characterCost, weaponCost]) => {
        const cost = new ItemList().combine(characterCost).combine(weaponCost);
        this.logger.info('update materials need', cost);
        this.#cost.next(cost);
      });
  }

  private updateDetails(): void {
    combineLatest([this.#inventory, this.#cost])
      .pipe(switchMap(([inventory, cost]) =>
        this.details.pipe(
          first(),
          map(details => this.processDetails(details, inventory, cost))
        )
      ))
      .subscribe(details => {
        this.logger.info('updated inventory details', details);
        this.#details.next(details);
      });
  }

  private processDetails(details: Map<number, InventoryItemDetail>, inventory: ItemList, cost: ItemList): Map<number, InventoryItemDetail> {
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
    return this.materials.processSpecialDetails(details);
  }

  private updateDatabaseInventory(id: number, amount: number): Observable<any[]> {
    return this.database.update(this.storeName, {id, amount});
  }
}
