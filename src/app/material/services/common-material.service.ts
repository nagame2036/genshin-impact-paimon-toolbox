import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CommonMaterial, CommonMaterialItem} from '../models/common-material.model';
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
      this.#items = res.items.sort((a, b) => a.group - b.group || b.rarity - a.rarity);
      this.itemsSubject.next(this.#items);
    });
  }

  getByGroupAndRarity(group: number, rarity: Rarity): CommonMaterialItem {
    const index = this.#items.findIndex(it => it.group === group && it.rarity === rarity);
    return this.#items[index];
  }
}
