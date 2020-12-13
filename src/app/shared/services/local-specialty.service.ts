import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {LocalSpecialty, LocalSpecialtyItem} from '../models/materials/local-specialty';
import alasql from 'alasql';

@Injectable({
  providedIn: 'root'
})
export class LocalSpecialtyService {

  private dataSubject = new ReplaySubject<LocalSpecialty>(1);

  readonly data = this.dataSubject.asObservable();

  private itemsSubject = new ReplaySubject<LocalSpecialtyItem[]>(1);

  readonly items = this.itemsSubject.asObservable();

  readonly sql = 'SELECT *, 1 rarity FROM ? ORDER BY [group], rarity DESC';

  constructor(http: HttpClient) {
    http.get<LocalSpecialty>('assets/data/materials/local-specialties.json').subscribe(res => {
      this.dataSubject.next(res);
      this.itemsSubject.next(alasql(this.sql, [res.items]));
    });
  }
}
