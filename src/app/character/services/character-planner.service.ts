import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {CharacterPlan} from '../models/character-plan.model';
import {CharacterRequirementService} from './character-requirement.service';
import {TalentRequirementService} from './talent-requirement.service';
import {Character} from '../models/character.model';
import {CharacterInfo} from '../models/character-info.model';
import {TalentProgress} from '../models/talent-progress.model';
import {I18n} from '../../widget/models/i18n.model';
import {MaterialRequireList} from '../../material/collections/material-require-list';
import {MaterialService} from '../../material/services/material.service';
import {NGXLogger} from 'ngx-logger';
import {TalentInfoService} from './talent-info.service';
import {ItemPlanService} from '../../game-common/services/item-plan.service';

@Injectable({
  providedIn: 'root',
})
export class CharacterPlanner extends ItemPlanService<Character> {
  readonly type = 'character';

  private readonly i18n = I18n.create('game-common');

  constructor(
    private characterReq: CharacterRequirementService,
    private talentReq: TalentRequirementService,
    private talentInfos: TalentInfoService,
    materials: MaterialService,
    database: NgxIndexedDBService,
    logger: NGXLogger,
  ) {
    super('character-plans', materials, database, logger);
  }

  create(info: CharacterInfo, meta: {id: number}): CharacterPlan {
    const id = meta.id;
    const talents: TalentProgress = {};
    info.talents.forEach(t => (talents[t] = 1));
    return {id, ascension: 0, level: 1, talents};
  }

  protected getRequirements(item: Character): MaterialRequireList[] {
    const talents = this.talentInfos.getUpgradableInfos(item.info);
    return [...this.characterReq.requirement(item), ...this.talentReq.requirement(item, talents)];
  }

  protected getRequireLabels(item: Character): string[] {
    return [
      this.i18n.module('total-requirement'),
      this.characterReq.levelupLabel,
      ...this.talentInfos.getUpgradableInfos(item.info).map(it => this.talentReq.getLabel(it.id)),
    ];
  }
}
