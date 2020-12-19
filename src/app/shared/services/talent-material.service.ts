import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {TalentMaterial, TalentMaterialGroup, TalentMaterialItem} from '../models/materials/talent-material';
import alasql from 'alasql';

@Injectable({
  providedIn: 'root'
})
export class TalentMaterialService {

  #groups = new ReplaySubject<TalentMaterialGroup[]>(1);

  readonly groups = this.#groups.asObservable();

  #items = new ReplaySubject<TalentMaterialItem[]>(1);

  readonly items = this.#items.asObservable();

  constructor(http: HttpClient) {
    http.get<TalentMaterial>('assets/data/materials/talent-materials.json').subscribe(res => {
      this.#groups.next(res.groups);
      const sql = 'SELECT * FROM ? ORDER BY [group], rarity DESC';
      this.#items.next(alasql(sql, [res.items]));
    });
  }
}
