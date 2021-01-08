import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {WeaponMaterial, WeaponMaterialItem} from '../models/weapon-material.model';
import {Rarity} from '../../shared/models/rarity.type';
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
      this.#groups = new Map();
      res.groups.forEach(it => this.#groups.set(it.id, it));
      this.#items = res.items.sort((a, b) => a.group - b.group || b.rarity - a.rarity);
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
