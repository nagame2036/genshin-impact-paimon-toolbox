import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {WeaponExpMaterial, WeaponExpMaterialItem} from '../models/materials/weapon-exp-material';
import alasql from 'alasql';

@Injectable({
  providedIn: 'root'
})
export class WeaponExpMaterialService {

  private dataSubject = new ReplaySubject<WeaponExpMaterial>(1);

  readonly data = this.dataSubject.asObservable();

  private itemsSubject = new ReplaySubject<WeaponExpMaterialItem[]>(1);

  readonly items = this.itemsSubject.asObservable();

  readonly sql = 'SELECT * FROM ? ORDER BY [group], rarity DESC';

  constructor(http: HttpClient) {
    http.get<WeaponExpMaterial>('assets/data/materials/weapon-exp-materials.json').subscribe(res => {
      this.dataSubject.next(res);
      this.itemsSubject.next(alasql(this.sql, [res.items]));
    });
  }
}