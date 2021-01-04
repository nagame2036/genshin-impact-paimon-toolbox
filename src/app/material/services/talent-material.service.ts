import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {TalentMaterial, TalentMaterialGroup, TalentMaterialItem} from '../models/talent-material.model';
import alasql from 'alasql';
import {Rarity} from '../../shared/models/rarity.enum';

@Injectable({
  providedIn: 'root'
})
export class TalentMaterialService {

  #groups!: Map<number, TalentMaterialGroup>;

  #items!: TalentMaterialItem[];

  private itemsSubject = new ReplaySubject<TalentMaterialItem[]>(1);

  readonly items = this.itemsSubject.asObservable();

  constructor(http: HttpClient) {
    http.get<TalentMaterial>('assets/data/materials/talent-materials.json').subscribe(res => {
      const sql = 'SELECT * FROM ? ORDER BY [group], rarity DESC';
      this.#items = alasql(sql, [res.items]);
      this.#groups = new Map();
      res.groups.forEach(it => this.#groups.set(it.id, it));
      this.itemsSubject.next(this.#items);
    });
  }

  getByGroupAndRarity(group: number, rarity: Rarity): TalentMaterialItem {
    const index = this.#items.findIndex(it => it.group === group && it.rarity === rarity);
    return this.#items[index];
  }

  getWeekday(item: TalentMaterialItem): number {
    return this.#groups.get(item.group)?.weekday ?? 0;
  }
}
