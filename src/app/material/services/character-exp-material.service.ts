import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {CharacterExpMaterial, CharacterExpMaterialGroup, CharacterExpMaterialItem} from '../models/character-exp-material';
import {HttpClient} from '@angular/common/http';
import alasql from 'alasql';

@Injectable({
  providedIn: 'root'
})
export class CharacterExpMaterialService {

  #groups = new ReplaySubject<CharacterExpMaterialGroup[]>(1);

  readonly groups = this.#groups.asObservable();

  #items = new ReplaySubject<CharacterExpMaterialItem[]>(1);

  readonly items = this.#items.asObservable();

  constructor(http: HttpClient) {
    http.get<CharacterExpMaterial>('assets/data/materials/character-exp-materials.json').subscribe(res => {
      this.#groups.next(res.groups);
      const sql = 'SELECT * FROM ? ORDER BY [group], rarity DESC';
      this.#items.next(alasql(sql, [res.items]));
    });
  }
}
