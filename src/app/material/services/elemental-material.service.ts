import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ElementalMaterial, ElementalMaterialGroup, ElementalMaterialItem} from '../models/elemental-material';
import alasql from 'alasql';

@Injectable({
  providedIn: 'root'
})
export class ElementalMaterialService {

  #groups = new ReplaySubject<ElementalMaterialGroup[]>(1);

  readonly groups = this.#groups.asObservable();

  #items = new ReplaySubject<ElementalMaterialItem[]>(1);

  readonly items = this.#items.asObservable();

  constructor(http: HttpClient) {
    http.get<ElementalMaterial>('assets/data/materials/elemental-materials.json').subscribe(res => {
      this.#groups.next(res.groups);
      const sql = 'SELECT * FROM ? ORDER BY [group], rarity DESC';
      this.#items.next(alasql(sql, [res.items]));
    });
  }
}
