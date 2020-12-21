import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {WeaponMaterial, WeaponMaterialGroup, WeaponMaterialItem} from '../models/weapon-material';
import alasql from 'alasql';

@Injectable({
  providedIn: 'root'
})
export class WeaponMaterialService {

  #groups = new ReplaySubject<WeaponMaterialGroup[]>(1);

  readonly groups = this.#groups.asObservable();

  #items = new ReplaySubject<WeaponMaterialItem[]>(1);

  readonly items = this.#items.asObservable();

  constructor(http: HttpClient) {
    http.get<WeaponMaterial>('assets/data/materials/weapon-materials.json').subscribe(res => {
      this.#groups.next(res.groups);
      const sql = 'SELECT * FROM ? ORDER BY [group], rarity DESC';
      this.#items.next(alasql(sql, [res.items]));
    });
  }
}
