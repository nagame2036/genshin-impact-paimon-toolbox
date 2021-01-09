import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {WeaponExpMaterial} from '../models/weapon-exp-material.model';
import {calculateExpNeed, processExpDetails} from '../utils/exp-details';
import {InventoryItemDetail} from '../models/inventory-item-detail.model';
import {weaponExp} from '../models/mora-and-exp.model';

@Injectable({
  providedIn: 'root'
})
export class WeaponExpMaterialService {

  #items: WeaponExpMaterial[] = [];

  private itemsSubject = new ReplaySubject<WeaponExpMaterial[]>(1);

  readonly items = this.itemsSubject.asObservable();

  constructor(http: HttpClient) {
    http.get<WeaponExpMaterial[]>('assets/data/materials/weapon-exp-materials.json').subscribe(res => {
      this.#items = res.sort((a, b) => b.rarity - a.rarity);
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
