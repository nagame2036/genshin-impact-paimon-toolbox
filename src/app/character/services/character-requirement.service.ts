import {Injectable} from '@angular/core';
import {CharacterAscendCost} from '../models/character-ascend-cost.model';
import {MaterialInfoService} from '../../material/services/material-info.service';
import {Character} from '../models/character.model';
import {processExpBonus} from '../../game-common/models/levelup-exp-bonus.model';
import {characterExp, mora} from '../../material/models/mora-and-exp.model';
import {I18n} from '../../widget/models/i18n.model';
import {NGXLogger} from 'ngx-logger';
import {MaterialRequireList} from '../../material/collections/material-require-list';
import {RequireMark} from '../../material/models/material-require-mark.model';
import {CharacterPlan} from '../models/character-plan.model';
import ascendCost from '../../../data/character/character-ascend-cost.json';
import levelupCost from '../../../data/character/character-levelup-cost.json';

@Injectable({
  providedIn: 'root',
})
export class CharacterRequirementService {
  readonly i18n = I18n.create('game-common');

  readonly ascendLabel = this.i18n.dict('ascend');

  readonly levelupLabel = this.i18n.dict('levelup');

  private readonly ascensions = ascendCost as CharacterAscendCost[];

  private readonly levels = levelupCost;

  constructor(private materials: MaterialInfoService, private logger: NGXLogger) {
    logger.info('loaded ascend cost', this.ascensions);
    logger.info('loaded levelup cost', this.levels);
  }

  requirement(item: Character): MaterialRequireList[] {
    return [this.ascend(item), this.levelup(item)];
  }

  private ascend({info, progress, plan}: Character): MaterialRequireList {
    const req = new MaterialRequireList();
    const {boss, gem, local, mob} = info.materials;
    const start = progress.ascension;
    const goal = plan.ascension;
    const mark = this.getMark(plan, this.ascendLabel, `★${start}`, `★${goal}`);
    for (const cost of this.ascensions.slice(start, goal)) {
      req.mark(mora.id, cost.mora, mark);
      if (boss) {
        req.mark(boss, cost.boss, mark);
      }
      this.materials.markGroup(req, gem, cost.gem, mark);
      req.mark(local, cost.local, mark);
      this.materials.markGroup(req, mob, cost.mob, mark);
    }
    return req;
  }

  private levelup({info, progress, plan}: Character): MaterialRequireList {
    const req = new MaterialRequireList();
    const start = progress.level;
    const goal = plan.level;
    const mark = this.getMark(plan, this.levelupLabel, `${start}`, `${goal}`);
    const expAmount = this.levels.slice(start, goal).reduce((sum, curr) => sum + curr, 0);
    const {moraCost, expCost} = processExpBonus(info, expAmount, 0.2);
    req.mark(mora.id, moraCost, mark);
    req.mark(characterExp.id, expCost, mark);
    this.materials.processSpecialRequirement(req, mark);
    return req;
  }

  private getMark(plan: CharacterPlan, purpose: string, start: string, goal: string): RequireMark {
    const purposeType = this.levelupLabel;
    return {type: 'character', id: plan.id, key: plan.id, purposeType, purpose, start, goal};
  }
}
