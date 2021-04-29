import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {WeaponPlan} from '../models/weapon-plan.model';
import {MaterialRequireList} from '../../material/collections/material-require-list';
import {WeaponRequirementService} from './weapon-requirement.service';
import {Weapon} from '../models/weapon.model';
import {I18n} from '../../widget/models/i18n.model';
import {NGXLogger} from 'ngx-logger';
import {MaterialService} from '../../material/services/material.service';
import {WeaponInfo} from '../models/weapon-info.model';
import {ItemPlanService} from '../../game-common/services/item-plan.service';

@Injectable({
  providedIn: 'root',
})
export class WeaponPlanner extends ItemPlanService<Weapon> {
  readonly type = 'weapon';

  private readonly i18n = I18n.create('game-common');

  constructor(
    private weaponReq: WeaponRequirementService,
    materials: MaterialService,
    database: NgxIndexedDBService,
    logger: NGXLogger,
  ) {
    super('weapon-plans', materials, database, logger);
  }

  create(info: WeaponInfo, meta: {id: number}): WeaponPlan {
    const id = meta.id;
    return {id, infoId: info.id, ascension: 0, level: 1};
  }

  protected getRequirements(item: Weapon): MaterialRequireList[] {
    return this.weaponReq.requirement(item);
  }

  protected getRequireLabels(item: Weapon): string[] {
    return [this.i18n.module('total-requirement'), this.weaponReq.levelupLabel];
  }
}
