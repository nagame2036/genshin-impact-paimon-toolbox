import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {TalentMaterial, TalentMaterialItem} from '../models/talent-material.model';
import alasql from 'alasql';
import {Rarity} from '../../shared/models/rarity.enum';

@Injectable({
  providedIn: 'root'
})
export class TalentMaterialService {

  #items!: TalentMaterialItem[];

  private itemsSubject = new ReplaySubject<TalentMaterialItem[]>(1);

  readonly items = this.itemsSubject.asObservable();

  constructor(http: HttpClient) {
    http.get<TalentMaterial>('assets/data/materials/talent-materials.json').subscribe(res => {
      const sql = 'SELECT * FROM ? ORDER BY [group], rarity DESC';
      this.#items = alasql(sql, [res.items]);
      this.itemsSubject.next(this.#items);
    });
  }

  getByGroupAndRarity(group: number, rarity: Rarity): TalentMaterialItem {
    const sql = 'SELECT * FROM ? WHERE [group] = ? AND rarity = ?';
    return alasql(sql, [this.#items, group, rarity])[0];
  }
}
