import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {OreMaterial} from '../models/ore-material.model';

@Injectable({
  providedIn: 'root'
})
export class OreMaterialService {

  #items = new ReplaySubject<OreMaterial[]>(1);

  readonly items = this.#items.asObservable();

  constructor(http: HttpClient) {
    http.get<OreMaterial[]>('assets/data/materials/ore-materials.json').subscribe(res => this.#items.next(res));
  }
}
