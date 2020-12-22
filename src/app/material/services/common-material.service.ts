import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CommonMaterial, CommonMaterialItem} from '../models/common-material.model';
import alasql from 'alasql';
import {Rarity} from '../../shared/models/rarity.enum';

@Injectable({
  providedIn: 'root'
})
export class CommonMaterialService {

  #items!: CommonMaterialItem[];

  private readonly itemsSubject = new ReplaySubject<CommonMaterialItem[]>(1);

  readonly items = this.itemsSubject.asObservable();

  constructor(http: HttpClient) {
    http.get<CommonMaterial>('assets/data/materials/common-materials.json').subscribe(res => {
      const sql = 'SELECT * FROM ? ORDER BY [group], rarity DESC';
      this.#items = alasql(sql, [res.items]);
      this.itemsSubject.next(this.#items);
    });
  }

  getByGroupAndRarity(group: number, rarity: Rarity): CommonMaterialItem {
    const sql = 'SELECT * FROM ? WHERE [group] = ? AND rarity = ?';
    return alasql(sql, [this.#items, group, rarity])[0];
  }
}
