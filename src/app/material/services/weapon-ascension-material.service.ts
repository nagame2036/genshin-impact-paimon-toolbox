import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {
  WeaponAscensionMaterial,
  WeaponAscensionMaterialItem,
} from '../models/weapon-ascension-material.model';
import {Rarity} from '../../game-common/models/rarity.type';
import {
  TalentLevelupMaterialGroup,
  TalentLevelupMaterialItem,
} from '../models/talent-levelup-material.model';
import {MaterialInfo} from '../models/material.model';
import {NGXLogger} from 'ngx-logger';
import {materialData} from './material-data';

@Injectable({
  providedIn: 'root',
})
export class WeaponAscensionMaterialService {
  #groups!: Map<number, TalentLevelupMaterialGroup>;

  #items!: WeaponAscensionMaterialItem[];

  private items$ = new ReplaySubject<WeaponAscensionMaterialItem[]>(1);

  readonly items = this.items$.asObservable();

  constructor(http: HttpClient, private logger: NGXLogger) {
    http
      .get<WeaponAscensionMaterial>(materialData('weapon-ascension-materials'))
      .subscribe(data => {
        this.logger.info('loaded weapon ascension materials', data);
        this.#groups = new Map();
        data.groups.forEach(it => this.#groups.set(it.id, it));
        this.#items = data.items.sort(
          (a, b) => a.group - b.group || b.rarity - a.rarity,
        );
        this.items$.next(this.#items);
      });
  }

  get(group: number, rarity: Rarity): TalentLevelupMaterialItem {
    const index = this.#items.findIndex(
      it => it.group === group && it.rarity === rarity,
    );
    return this.#items[index];
  }

  getWeekday(item: MaterialInfo): number {
    return this.#groups.get(item?.group ?? -1)?.weekday ?? 0;
  }
}
