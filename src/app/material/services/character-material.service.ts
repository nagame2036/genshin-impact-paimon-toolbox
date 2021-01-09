import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CharacterMaterial, CharacterMaterialItem} from '../models/character-material.model';
import {Rarity} from '../../shared/models/rarity.type';

@Injectable({
  providedIn: 'root'
})
export class CharacterMaterialService {

  #items!: CharacterMaterialItem[];

  private itemsSubject = new ReplaySubject<CharacterMaterialItem[]>(1);

  readonly items = this.itemsSubject.asObservable();

  constructor(http: HttpClient) {
    http.get<CharacterMaterial>('assets/data/materials/character-materials.json').subscribe(res => {
      this.#items = res.items.sort((a, b) => a.group - b.group || b.rarity - a.rarity);
      this.itemsSubject.next(this.#items);
    });
  }

  getByGroupAndRarity(group: number, rarity: Rarity): CharacterMaterialItem {
    const index = this.#items.findIndex(it => it.group === group && it.rarity === rarity);
    return this.#items[index];
  }
}
