import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {CharacterExpMaterial, CharacterExpMaterialGroup, CharacterExpMaterialItem} from '../models/character-exp-material.model';
import {HttpClient} from '@angular/common/http';
import {calculateExpNeed, processExpDetails} from '../utils/exp-details';
import {InventoryItemDetail} from '../models/inventory-item-detail.model';
import {characterExp} from '../models/mora-and-exp.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterExpMaterialService {

  #groups = new ReplaySubject<CharacterExpMaterialGroup[]>(1);

  readonly groups = this.#groups.asObservable();

  #items: CharacterExpMaterialItem[] = [];

  private itemsSubject = new ReplaySubject<CharacterExpMaterialItem[]>(1);

  readonly items = this.itemsSubject.asObservable();

  constructor(http: HttpClient) {
    http.get<CharacterExpMaterial>('assets/data/materials/character-exp-materials.json').subscribe(res => {
      this.#groups.next(res.groups);
      this.#items = res.items.sort((a, b) => a.group - b.group || b.rarity - a.rarity);
      this.itemsSubject.next(this.#items);
    });
  }

  calculateExpNeed(details: Map<number, InventoryItemDetail>): void {
    calculateExpNeed(characterExp.id, this.#items, details);
  }

  processExpDetails(details: Map<number, InventoryItemDetail>): void {
    processExpDetails(characterExp.id, this.#items, details);
  }
}
