import {Injectable} from '@angular/core';
import {WeaponProgress} from '../models/weapon-progress.model';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {WeaponInfo} from '../models/weapon-info.model';
import {Weapon} from '../models/weapon.model';
import {ItemProgressService} from '../../game-common/services/item-progress.service';

@Injectable({
  providedIn: 'root',
})
export class WeaponProgressService extends ItemProgressService<Weapon> {
  constructor(database: NgxIndexedDBService, logger: NGXLogger) {
    super('weapon-progresses', database, logger);
  }

  create(info: WeaponInfo, meta: {id: number}): WeaponProgress {
    const id = meta.id;
    return {id, infoId: info.id, refine: 1, ascension: 0, level: 1};
  }

  getMaxLevel(info: WeaponInfo): number {
    return 90;
  }
}
