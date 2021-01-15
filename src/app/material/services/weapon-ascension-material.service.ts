import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {WeaponAscensionMaterial, WeaponAscensionMaterialItem} from '../models/weapon-ascension-material.model';
import {Rarity} from '../../shared/models/rarity.type';
import {TalentLevelupMaterialGroup, TalentLevelupMaterialItem} from '../models/talent-levelup-material.model';
import {InventoryItem} from '../models/inventory-item.model';

@Injectable({
  providedIn: 'root'
})
export class WeaponAscensionMaterialService {

  #groups!: Map<number, TalentLevelupMaterialGroup>;

  #items!: WeaponAscensionMaterialItem[];

  private itemsSubject = new ReplaySubject<WeaponAscensionMaterialItem[]>(1);

  readonly items = this.itemsSubject.asObservable();

  constructor(http: HttpClient) {
    http.get<WeaponAscensionMaterial>('assets/data/materials/weapon-ascension-materials.json').subscribe(res => {
      this.#groups = new Map();
      res.groups.forEach(it => this.#groups.set(it.id, it));
      this.#items = res.items.sort((a, b) => a.group - b.group || b.rarity - a.rarity);
      this.itemsSubject.next(this.#items);
    });
  }

  getByGroupAndRarity(group: number, rarity: Rarity): TalentLevelupMaterialItem {
    const index = this.#items.findIndex(it => it.group === group && it.rarity === rarity);
    return this.#items[index];
  }

  getWeekday(item: InventoryItem): number {
    return this.#groups.get(item?.group ?? -1)?.weekday ?? 0;
  }
}
