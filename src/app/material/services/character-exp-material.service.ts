import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {CharacterExpMaterial} from '../models/character-exp-material.model';
import {HttpClient} from '@angular/common/http';
import {processExpMaterials, splitExpNeed} from '../utils/exp-details';
import {MaterialDetail} from '../models/material.model';
import {characterExp} from '../models/mora-and-exp.model';
import {MaterialRequireList} from '../collections/material-require-list';
import {RequireMark} from '../models/material-require-mark.model';
import {NGXLogger} from 'ngx-logger';
import {materialData} from './material-data';

@Injectable({
  providedIn: 'root',
})
export class CharacterExpMaterialService {
  #items: CharacterExpMaterial[] = [];

  private items$ = new ReplaySubject<CharacterExpMaterial[]>(1);

  readonly items = this.items$.asObservable();

  constructor(http: HttpClient, private logger: NGXLogger) {
    http
      .get<CharacterExpMaterial[]>(materialData('character-exp-materials'))
      .subscribe(data => {
        this.logger.info('loaded character exp materials', data);
        this.#items = data.sort((a, b) => b.rarity - a.rarity);
        this.items$.next(this.#items);
      });
  }

  splitExpNeed(requirement: MaterialRequireList, mark: RequireMark): void {
    splitExpNeed(characterExp.id, this.#items, requirement, mark);
  }

  processExpMaterials(materials: Map<number, MaterialDetail>): void {
    processExpMaterials(characterExp.id, this.#items, materials);
  }
}
