import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {TalentMaterial, TalentMaterialGroup, TalentMaterialItem} from '../models/talent-material.model';
import alasql from 'alasql';
import {Rarity} from '../../shared/models/rarity.enum';
import {WeaponMaterialItem} from '../models/weapon-material.model';
import {map} from 'rxjs/operators';
import {partitionArrays} from '../../shared/utils/collections';

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

  partitionWeekday(): Observable<WeaponMaterialItem[][]> {
    return this.items.pipe(map(res => partitionArrays(res, [
      item => this.getWeekday(item) === 14,
      item => this.getWeekday(item) === 25,
      item => this.getWeekday(item) === 36,
    ])));
  }

  getByGroupAndRarity(group: number, rarity: Rarity): TalentMaterialItem {
    const sql = 'SELECT * FROM ? WHERE [group] = ? AND rarity = ?';
    return alasql(sql, [this.#items, group, rarity])[0];
  }

  private getWeekday(item: TalentMaterialItem): number {
    return this.#groups.get(item.group)?.weekday ?? 0;
  }
}
