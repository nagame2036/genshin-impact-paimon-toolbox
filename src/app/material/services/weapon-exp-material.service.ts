import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {WeaponExpMaterial} from '../models/weapon-exp-material.model';
import {processExpMaterials, splitExpNeed} from '../utils/exp-details';
import {MaterialDetail} from '../models/material.model';
import {weaponExp} from '../models/mora-and-exp.model';
import {MaterialRequireList} from '../collections/material-require-list';
import {RequireMark} from '../models/material-require-mark.model';
import {NGXLogger} from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class WeaponExpMaterialService {

  #items: WeaponExpMaterial[] = [];

  private items$ = new ReplaySubject<WeaponExpMaterial[]>(1);

  readonly items = this.items$.asObservable();

  constructor(http: HttpClient, private logger: NGXLogger) {
    http.get<WeaponExpMaterial[]>('assets/data/materials/weapon-exp-materials.json').subscribe(data => {
      this.logger.info('loaded weapon exp materials', data);
      this.#items = data.sort((a, b) => b.rarity - a.rarity);
      this.items$.next(this.#items);
    });
  }

  splitExpNeed(requirement: MaterialRequireList, mark: RequireMark): void {
    splitExpNeed(weaponExp.id, this.#items, requirement, mark);
  }

  processExpMaterials(details: Map<number, MaterialDetail>): void {
    processExpMaterials(weaponExp.id, this.#items, details);
  }
}
