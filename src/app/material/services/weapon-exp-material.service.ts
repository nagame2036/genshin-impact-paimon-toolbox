import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {WeaponExpMaterial, WeaponExpMaterialGroup, WeaponExpMaterialItem} from '../models/weapon-exp-material.model';
import alasql from 'alasql';

@Injectable({
  providedIn: 'root'
})
export class WeaponExpMaterialService {

  #groups = new ReplaySubject<WeaponExpMaterialGroup[]>(1);

  readonly groups = this.#groups.asObservable();

  #items = new ReplaySubject<WeaponExpMaterialItem[]>(1);

  readonly items = this.#items.asObservable();

  constructor(http: HttpClient) {
    http.get<WeaponExpMaterial>('assets/data/materials/weapon-exp-materials.json').subscribe(res => {
      this.#groups.next(res.groups);
      const sql = 'SELECT * FROM ? ORDER BY [group], rarity DESC';
      this.#items.next(alasql(sql, [res.items]));
    });
  }
}
