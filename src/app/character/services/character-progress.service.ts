import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {CharacterInfo} from '../models/character-info.model';
import {CharacterProgress} from '../models/character-progress.model';
import {TalentProgress} from '../models/talent-progress.model';
import {Character} from '../models/character.model';
import {CharacterInfoService} from './character-info.service';
import {ItemProgressService} from '../../game-common/services/item-progress.service';

@Injectable({
  providedIn: 'root',
})
export class CharacterProgressService extends ItemProgressService<Character> {
  constructor(
    private information: CharacterInfoService,
    database: NgxIndexedDBService,
    logger: NGXLogger,
  ) {
    super('character-progresses', database, logger);
  }

  create(info: CharacterInfo, meta: {id: number}): CharacterProgress {
    const id = meta.id;
    const talents: TalentProgress = {};
    info.talents.forEach(t => (talents[t] = 1));
    return {id, constellation: 0, ascension: 0, level: 1, talents};
  }

  getMaxLevel(info: CharacterInfo): number {
    return 90;
  }
}
