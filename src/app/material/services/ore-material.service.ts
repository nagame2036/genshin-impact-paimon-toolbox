import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {OreMaterial} from '../models/ore-material.model';
import {NGXLogger} from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class OreMaterialService {

  #items = new ReplaySubject<OreMaterial[]>(1);

  readonly items = this.#items.asObservable();

  constructor(http: HttpClient, private logger: NGXLogger) {
    http.get<OreMaterial[]>('assets/data/materials/ore-materials.json').subscribe(data => {
      data.forEach(it => it.rarity = 1);
      this.logger.info('loaded ores', data);
      this.#items.next(data);
    });
  }
}