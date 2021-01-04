import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {WeaponExpMaterial, WeaponExpMaterialGroup, WeaponExpMaterialItem} from '../models/weapon-exp-material.model';
import alasql from 'alasql';
import {ItemAmount} from '../models/item-amount.model';
import {map} from 'rxjs/operators';
import {expAmount} from '../utils/exp-amount';
import {ItemCostList} from '../../plan/models/item-cost-list.model';
import {divideExps} from '../../inventory/utils/divide-exps';

@Injectable({
  providedIn: 'root'
})
export class WeaponExpMaterialService {

  #groups = new ReplaySubject<WeaponExpMaterialGroup[]>(1);

  readonly groups = this.#groups.asObservable();

  #items = new ReplaySubject<WeaponExpMaterialItem[]>(1);

  readonly items = this.#items.asObservable();

  constructor(http: HttpClient) {
    http.get<WeaponExpMaterial>('assets/data/materials/weapon-exp-materials.json').subscribe(res => {
      this.#groups.next(res.groups);
      const sql = 'SELECT * FROM ? ORDER BY [group], rarity DESC';
      this.#items.next(alasql(sql, [res.items]));
    });
  }

  getExp(inventory: Map<number, ItemAmount>): Observable<number> {
    return this.items.pipe(map(items => expAmount(inventory, items)));
  }

  expHasOverflow(inventory: Map<number, ItemAmount>, cost: ItemCostList, lack: number): Observable<boolean> {
    return this.getExp(inventory).pipe(map(expHad => lack === 0 || expHad >= cost.get(2)));
  }

  divideExpMaterials(inventory: Map<number, ItemAmount>, cost: ItemCostList): Observable<ItemCostList> {
    return this.items.pipe(map(items => divideExps(cost.get(2), items, cost)));
  }
}
