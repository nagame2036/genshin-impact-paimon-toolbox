import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {CharacterExpMaterial, CharacterExpMaterialItem} from '../models/materials/character-exp-material';
import {HttpClient} from '@angular/common/http';
import alasql from 'alasql';

@Injectable({
  providedIn: 'root'
})
export class CharacterExpMaterialService {

  private dataSubject = new ReplaySubject<CharacterExpMaterial>(1);

  readonly data = this.dataSubject.asObservable();

  private itemsSubject = new ReplaySubject<CharacterExpMaterialItem[]>(1);

  readonly items = this.itemsSubject.asObservable();

  readonly sql = 'SELECT * FROM ? ORDER BY [group], rarity DESC';

  constructor(http: HttpClient) {
    http.get<CharacterExpMaterial>('assets/data/materials/character-exp-materials.json').subscribe(res => {
      this.dataSubject.next(res);
      this.itemsSubject.next(alasql(this.sql, [res.items]));
    });
  }
}
