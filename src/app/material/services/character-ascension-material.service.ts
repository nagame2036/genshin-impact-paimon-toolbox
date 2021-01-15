import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CharacterAscensionMaterial, CharacterAscensionMaterialItem} from '../models/character-ascension-material.model';
import {Rarity} from '../../shared/models/rarity.type';

@Injectable({
  providedIn: 'root'
})
export class CharacterAscensionMaterialService {

  #items!: CharacterAscensionMaterialItem[];

  private itemsSubject = new ReplaySubject<CharacterAscensionMaterialItem[]>(1);

  readonly items = this.itemsSubject.asObservable();

  constructor(http: HttpClient) {
    http.get<CharacterAscensionMaterial>('assets/data/materials/character-ascension-materials.json').subscribe(res => {
      this.#items = res.items.sort((a, b) => a.group - b.group || b.rarity - a.rarity);
      this.itemsSubject.next(this.#items);
    });
  }

  getByGroupAndRarity(group: number, rarity: Rarity): CharacterAscensionMaterialItem {
    const index = this.#items.findIndex(it => it.group === group && it.rarity === rarity);
    return this.#items[index];
  }
}
