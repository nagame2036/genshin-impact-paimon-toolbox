import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CharacterAscensionMaterial, CharacterAscensionMaterialItem} from '../models/character-ascension-material.model';
import {Rarity} from '../../game-common/models/rarity.type';
import {NGXLogger} from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class CharacterAscensionMaterialService {

  #items!: CharacterAscensionMaterialItem[];

  private items$ = new ReplaySubject<CharacterAscensionMaterialItem[]>(1);

  readonly items = this.items$.asObservable();

  constructor(http: HttpClient, private logger: NGXLogger) {
    http.get<CharacterAscensionMaterial>('assets/data/materials/character-ascension-materials.json').subscribe(data => {
      this.logger.info('loaded character ascension materials', data);
      this.#items = data.items.sort((a, b) => a.group - b.group || b.rarity - a.rarity);
      this.items$.next(this.#items);
    });
  }

  getByGroupAndRarity(group: number, rarity: Rarity): CharacterAscensionMaterialItem {
    const index = this.#items.findIndex(it => it.group === group && it.rarity === rarity);
    return this.#items[index];
  }
}
