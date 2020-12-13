import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ElementalMaterial, ElementalMaterialItem} from '../models/materials/elemental-material';
import alasql from 'alasql';

@Injectable({
  providedIn: 'root'
})
export class ElementalMaterialService {

  private dataSubject = new ReplaySubject<ElementalMaterial>(1);

  readonly data = this.dataSubject.asObservable();

  private itemsSubject = new ReplaySubject<ElementalMaterialItem[]>(1);

  readonly items = this.itemsSubject.asObservable();

  readonly sql = 'SELECT * FROM ? ORDER BY [group], rarity DESC';

  constructor(http: HttpClient) {
    http.get<ElementalMaterial>('assets/data/materials/elemental-materials.json').subscribe(res => {
      this.dataSubject.next(res);
      this.itemsSubject.next(alasql(this.sql, [res.items]));
    });
  }
}
