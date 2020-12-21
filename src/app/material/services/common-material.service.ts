import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CommonMaterial, CommonMaterialGroup, CommonMaterialItem} from '../models/common-material.model';
import alasql from 'alasql';

@Injectable({
  providedIn: 'root'
})
export class CommonMaterialService {

  #groups = new ReplaySubject<CommonMaterialGroup[]>(1);

  readonly groups = this.#groups.asObservable();

  #items = new ReplaySubject<CommonMaterialItem[]>(1);

  readonly items = this.#items.asObservable();

  constructor(http: HttpClient) {
    http.get<CommonMaterial>('assets/data/materials/common-materials.json').subscribe(res => {
      this.#groups.next(res.groups);
      const sql = 'SELECT * FROM ? ORDER BY [group], rarity DESC';
      this.#items.next(alasql(sql, [res.items]));
    });
  }
}
