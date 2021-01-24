import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {CharacterExpMaterial} from '../models/character-exp-material.model';
import {HttpClient} from '@angular/common/http';
import {processExpDetails, splitExpNeed} from '../utils/exp-details';
import {InventoryItemDetail} from '../models/inventory-item-detail.model';
import {characterExp} from '../models/mora-and-exp.model';
import {ItemList} from '../models/item-list.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterExpMaterialService {

  #items: CharacterExpMaterial[] = [];

  private itemsSubject = new ReplaySubject<CharacterExpMaterial[]>(1);

  readonly items = this.itemsSubject.asObservable();

  constructor(http: HttpClient) {
    http.get<CharacterExpMaterial[]>('assets/data/materials/character-exp-materials.json').subscribe(res => {
      this.#items = res.sort((a, b) => b.rarity - a.rarity);
      this.itemsSubject.next(this.#items);
    });
  }

  splitExpNeed(cost: ItemList): ItemList {
    const expNeed = cost.getAmount(characterExp.id);
    const exps = splitExpNeed(expNeed, this.#items);
    return cost.combine(exps);
  }

  processExpDetails(details: Map<number, InventoryItemDetail>): void {
    processExpDetails(characterExp.id, this.#items, details);
  }
}
