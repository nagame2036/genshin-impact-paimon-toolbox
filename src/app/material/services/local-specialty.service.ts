import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {LocalSpecialty, LocalSpecialtyGroup, LocalSpecialtyItem} from '../models/local-specialty.model';
import {NGXLogger} from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class LocalSpecialtyService {

  #groups = new ReplaySubject<LocalSpecialtyGroup[]>(1);

  readonly groups = this.#groups.asObservable();

  #items = new ReplaySubject<LocalSpecialtyItem[]>(1);

  readonly items = this.#items.asObservable();

  constructor(http: HttpClient, private logger: NGXLogger) {
    http.get<LocalSpecialty>('assets/data/materials/local-specialties.json').subscribe(data => {
      data.items.forEach(it => it.rarity = 1);
      this.logger.info('loaded local specialties', data);
      const items = data.items.sort((a, b) => a.group - b.group);
      this.#items.next(items);
    });
  }
}
