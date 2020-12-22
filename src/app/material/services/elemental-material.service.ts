import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ElementalMaterial, ElementalMaterialItem} from '../models/elemental-material.model';
import alasql from 'alasql';
import {Rarity} from '../../shared/models/rarity.enum';

@Injectable({
  providedIn: 'root'
})
export class ElementalMaterialService {

  #items!: ElementalMaterialItem[];

  private itemsSubject = new ReplaySubject<ElementalMaterialItem[]>(1);

  readonly items = this.itemsSubject.asObservable();

  constructor(http: HttpClient) {
    http.get<ElementalMaterial>('assets/data/materials/elemental-materials.json').subscribe(res => {
      const sql = 'SELECT * FROM ? ORDER BY [group], rarity DESC';
      this.#items = alasql(sql, [res.items]);
      this.itemsSubject.next(this.#items);
    });
  }

  getByGroupAndRarity(group: number, rarity: Rarity): ElementalMaterialItem {
    const sql = 'SELECT * FROM ? WHERE [group] = ? AND rarity = ?';
    return alasql(sql, [this.#items, group, rarity])[0];
  }
}
