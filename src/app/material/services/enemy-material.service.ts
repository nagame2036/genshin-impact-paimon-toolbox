import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {EnemiesMaterial, EnemiesMaterialItem} from '../models/enemies-material.model';
import {Rarity} from '../../game-common/models/rarity.type';
import {NGXLogger} from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class EnemyMaterialService {

  #items!: EnemiesMaterialItem[];

  private readonly items$ = new ReplaySubject<EnemiesMaterialItem[]>(1);

  readonly items = this.items$.asObservable();

  constructor(http: HttpClient, private logger: NGXLogger) {
    http.get<EnemiesMaterial>('assets/data/materials/enemy-materials.json').subscribe(data => {
      this.logger.info('loaded enemy materials', data);
      this.#items = data.items.sort((a, b) => a.group - b.group || b.rarity - a.rarity);
      this.items$.next(this.#items);
    });
  }

  getByGroupAndRarity(group: number, rarity: Rarity): EnemiesMaterialItem {
    const index = this.#items.findIndex(it => it.group === group && it.rarity === rarity);
    return this.#items[index];
  }
}
