import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CommonMaterial, CommonMaterialItem} from '../models/materials/common-material';
import alasql from 'alasql';

@Injectable({
  providedIn: 'root'
})
export class CommonMaterialService {

  private dataSubject = new ReplaySubject<CommonMaterial>(1);

  readonly data = this.dataSubject.asObservable();

  private itemsSubject = new ReplaySubject<CommonMaterialItem[]>(1);

  readonly items = this.itemsSubject.asObservable();

  readonly sql = 'SELECT * FROM ? ORDER BY [group], rarity DESC';

  constructor(http: HttpClient) {
    http.get<CommonMaterial>('assets/data/materials/common-materials.json').subscribe(res => {
      this.dataSubject.next(res);
      this.itemsSubject.next(alasql(this.sql, [res.items]));
    });
  }
}
