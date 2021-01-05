import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {WeaponExpMaterial, WeaponExpMaterialGroup, WeaponExpMaterialItem} from '../models/weapon-exp-material.model';
import alasql from 'alasql';
import {calculateExpNeed, processExpDetails} from '../utils/exp-details';
import {InventoryItemDetail} from '../models/inventory-item-detail.model';
import {weaponExp} from '../models/mora-and-exp.model';

@Injectable({
  providedIn: 'root'
})
export class WeaponExpMaterialService {

  #groups = new ReplaySubject<WeaponExpMaterialGroup[]>(1);

  readonly groups = this.#groups.asObservable();

  #items: WeaponExpMaterialItem[] = [];

  private itemsSubject = new ReplaySubject<WeaponExpMaterialItem[]>(1);

  readonly items = this.itemsSubject.asObservable();

  constructor(http: HttpClient) {
    http.get<WeaponExpMaterial>('assets/data/materials/weapon-exp-materials.json').subscribe(res => {
      this.#groups.next(res.groups);
      const sql = 'SELECT * FROM ? ORDER BY [group], rarity DESC';
      this.#items = alasql(sql, [res.items]);
      this.itemsSubject.next(this.#items);
    });
  }

  calculateExpNeed(details: Map<number, InventoryItemDetail>): void {
    calculateExpNeed(weaponExp.id, this.#items, details);
  }

  processExpDetails(details: Map<number, InventoryItemDetail>): void {
    processExpDetails(weaponExp.id, this.#items, details);
  }
}
