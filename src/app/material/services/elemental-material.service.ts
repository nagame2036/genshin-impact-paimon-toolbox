import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ElementalMaterial, ElementalMaterialItem} from '../models/elemental-material.model';
import {Rarity} from '../../shared/models/rarity.enum';

@Injectable({
  providedIn: 'root'
})
export class ElementalMaterialService {

  #items!: ElementalMaterialItem[];

  private itemsSubject = new ReplaySubject<ElementalMaterialItem[]>(1);

  readonly items = this.itemsSubject.asObservable();

  constructor(http: HttpClient) {
    http.get<ElementalMaterial>('assets/data/materials/elemental-materials.json').subscribe(res => {
      this.#items = res.items.sort((a, b) => a.group - b.group || b.rarity - a.rarity);
      this.itemsSubject.next(this.#items);
    });
  }

  getByGroupAndRarity(group: number, rarity: Rarity): ElementalMaterialItem {
    const index = this.#items.findIndex(it => it.group === group && it.rarity === rarity);
    return this.#items[index];
  }
}
