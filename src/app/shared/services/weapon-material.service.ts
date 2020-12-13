import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {WeaponMaterial, WeaponMaterialItem} from '../models/materials/weapon-material';
import alasql from 'alasql';

@Injectable({
  providedIn: 'root'
})
export class WeaponMaterialService {

  #data = new ReplaySubject<WeaponMaterial>(1);

  readonly data = this.#data.asObservable();

  #items = new ReplaySubject<WeaponMaterialItem[]>(1);

  readonly items = this.#items.asObservable();

  readonly sql = 'SELECT * FROM ? ORDER BY [group], rarity DESC';

  constructor(http: HttpClient) {
    http.get<WeaponMaterial>('assets/data/materials/weapon-materials.json').subscribe(res => {
      this.#data.next(res);
      this.#items.next(alasql(this.sql, [res.items]));
    });
  }
}
