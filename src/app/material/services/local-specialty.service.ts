import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {LocalSpecialty, LocalSpecialtyGroup, LocalSpecialtyItem} from '../models/local-specialty';
import alasql from 'alasql';

@Injectable({
  providedIn: 'root'
})
export class LocalSpecialtyService {

  #groups = new ReplaySubject<LocalSpecialtyGroup[]>(1);

  readonly groups = this.#groups.asObservable();

  #items = new ReplaySubject<LocalSpecialtyItem[]>(1);

  readonly items = this.#items.asObservable();

  constructor(http: HttpClient) {
    http.get<LocalSpecialty>('assets/data/materials/local-specialties.json').subscribe(res => {
      this.#groups.next(res.groups);
      const sql = 'SELECT *, 1 rarity FROM ? ORDER BY [group], rarity DESC';
      this.#items.next(alasql(sql, [res.items]));
    });
  }
}
