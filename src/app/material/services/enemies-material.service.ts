import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {EnemiesMaterial, EnemiesMaterialItem} from '../models/enemies-material.model';
import {Rarity} from '../../shared/models/rarity.type';

@Injectable({
  providedIn: 'root'
})
export class EnemiesMaterialService {

  #items!: EnemiesMaterialItem[];

  private readonly itemsSubject = new ReplaySubject<EnemiesMaterialItem[]>(1);

  readonly items = this.itemsSubject.asObservable();

  constructor(http: HttpClient) {
    http.get<EnemiesMaterial>('assets/data/materials/enemies-materials.json').subscribe(res => {
      this.#items = res.items.sort((a, b) => a.group - b.group || b.rarity - a.rarity);
      this.itemsSubject.next(this.#items);
    });
  }

  getByGroupAndRarity(group: number, rarity: Rarity): EnemiesMaterialItem {
    const index = this.#items.findIndex(it => it.group === group && it.rarity === rarity);
    return this.#items[index];
  }
}
