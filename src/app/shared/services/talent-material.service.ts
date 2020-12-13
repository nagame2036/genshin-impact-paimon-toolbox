import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {TalentMaterial, TalentMaterialItem} from '../models/materials/talent-material';
import alasql from 'alasql';

@Injectable({
  providedIn: 'root'
})
export class TalentMaterialService {

  private dataSubject = new ReplaySubject<TalentMaterial>(1);

  readonly data = this.dataSubject.asObservable();

  private itemsSubject = new ReplaySubject<TalentMaterialItem[]>(1);

  readonly items = this.itemsSubject.asObservable();

  readonly sql = 'SELECT * FROM ? ORDER BY [group], rarity DESC';

  constructor(http: HttpClient) {
    http.get<TalentMaterial>('assets/data/materials/talent-materials.json').subscribe(res => {
      this.dataSubject.next(res);
      this.itemsSubject.next(alasql(this.sql, [res.items]));
    });
  }
}
