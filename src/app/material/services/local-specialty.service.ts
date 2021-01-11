import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {LocalSpecialty, LocalSpecialtyGroup, LocalSpecialtyItem} from '../models/local-specialty.model';

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
      res.items.forEach(it => it.rarity = 1);
      const items = res.items.sort((a, b) => a.group - b.group);
      this.#items.next(items);
    });
  }
}
