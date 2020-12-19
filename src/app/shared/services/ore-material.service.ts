import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {OreMaterial, OreMaterialGroup, OreMaterialItem} from '../models/materials/ore-material';
import alasql from 'alasql';

@Injectable({
  providedIn: 'root'
})
export class OreMaterialService {

  #groups = new ReplaySubject<OreMaterialGroup[]>(1);

  readonly groups = this.#groups.asObservable();

  #items = new ReplaySubject<OreMaterialItem[]>(1);

  readonly items = this.#items.asObservable();

  readonly sql = 'SELECT *, 1 rarity FROM ? ORDER BY [group], rarity DESC';

  constructor(http: HttpClient) {
    http.get<OreMaterial>('assets/data/materials/ore-materials.json').subscribe(res => {
      this.#groups.next(res.groups);
      this.#items.next(alasql(this.sql, [res.items]));
    });
  }
}
