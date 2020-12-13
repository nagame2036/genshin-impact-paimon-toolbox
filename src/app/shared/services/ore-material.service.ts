import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {OreMaterial, OreMaterialItem} from '../models/materials/ore-material';
import alasql from 'alasql';

@Injectable({
  providedIn: 'root'
})
export class OreMaterialService {

  private dataSubject = new ReplaySubject<OreMaterial>(1);

  readonly data = this.dataSubject.asObservable();

  private itemsSubject = new ReplaySubject<OreMaterialItem[]>(1);

  readonly items = this.itemsSubject.asObservable();

  readonly sql = 'SELECT *, 1 rarity FROM ? ORDER BY [group], rarity DESC';

  constructor(http: HttpClient) {
    http.get<OreMaterial>('assets/data/materials/ore-materials.json').subscribe(res => {
      this.dataSubject.next(res);
      this.itemsSubject.next(alasql(this.sql, [res.items]));
    });
  }
}
