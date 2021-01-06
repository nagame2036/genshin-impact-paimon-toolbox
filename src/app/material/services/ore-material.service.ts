import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {OreMaterial, OreMaterialGroup, OreMaterialItem} from '../models/ore-material.model';

@Injectable({
  providedIn: 'root'
})
export class OreMaterialService {

  #groups = new ReplaySubject<OreMaterialGroup[]>(1);

  readonly groups = this.#groups.asObservable();

  #items = new ReplaySubject<OreMaterialItem[]>(1);

  readonly items = this.#items.asObservable();

  constructor(http: HttpClient) {
    http.get<OreMaterial>('assets/data/materials/ore-materials.json').subscribe(res => {
      this.#groups.next(res.groups);
      const items = res.items.sort((a, b) => a.group - b.group);
      this.#items.next(items);
    });
  }
}
