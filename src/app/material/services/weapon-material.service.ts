import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {WeaponMaterial, WeaponMaterialItem} from '../models/weapon-material.model';
import alasql from 'alasql';
import {Rarity} from '../../shared/models/rarity.enum';
import {TalentMaterialGroup, TalentMaterialItem} from '../models/talent-material.model';

@Injectable({
  providedIn: 'root'
})
export class WeaponMaterialService {

  #groups!: Map<number, TalentMaterialGroup>;

  #items!: WeaponMaterialItem[];

  private itemsSubject = new ReplaySubject<WeaponMaterialItem[]>(1);

  readonly items = this.itemsSubject.asObservable();

  constructor(http: HttpClient) {
    http.get<WeaponMaterial>('assets/data/materials/weapon-materials.json').subscribe(res => {
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
