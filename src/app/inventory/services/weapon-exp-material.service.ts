import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {WeaponExpMaterial} from '../models/weapon-exp-material.model';
import {processExpDetails, splitExpNeed} from '../utils/exp-details';
import {InventoryItemDetail} from '../models/inventory-item-detail.model';
import {weaponExp} from '../models/mora-and-exp.model';
import {ItemList} from '../models/item-list.model';
import {NGXLogger} from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class WeaponExpMaterialService {

  #items: WeaponExpMaterial[] = [];

  private itemsSubject = new ReplaySubject<WeaponExpMaterial[]>(1);

  readonly items = this.itemsSubject.asObservable();

  constructor(http: HttpClient, private logger: NGXLogger) {
    http.get<WeaponExpMaterial[]>('assets/data/materials/weapon-exp-materials.json').subscribe(data => {
      this.logger.info('loaded weapon exp materials', data);
      this.#items = data.sort((a, b) => b.rarity - a.rarity);
      this.itemsSubject.next(this.#items);
    });
  }

  splitExpNeed(cost: ItemList): ItemList {
    const expNeed = cost.getAmount(weaponExp.id);
    const exps = splitExpNeed(expNeed, this.#items);
    return cost.combine(exps);
  }

  processExpDetails(details: Map<number, InventoryItemDetail>): void {
    processExpDetails(weaponExp.id, this.#items, details);
  }
}
