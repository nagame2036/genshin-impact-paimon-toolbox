import {Injectable} from '@angular/core';
import {TalentLevelupCost} from '../models/talent-levelup-cost.model';
import {MaterialInfoService} from '../../material/services/material-info.service';
import {mora} from '../../material/models/mora-and-exp.model';
import {I18n} from '../../widget/models/i18n.model';
import {NGXLogger} from 'ngx-logger';
import {Character} from '../models/character.model';
import {MaterialRequireList} from '../../material/collections/material-require-list';
import {UpgradableTalentInfo} from '../models/talent-info.model';
import {RequireMark} from '../../material/models/material-require-mark.model';
import {CharacterPlan} from '../models/character-plan.model';
import levelupCost from '../../../data/character/talent-levelup-cost.json';

@Injectable({
  providedIn: 'root',
})
export class TalentRequirementService {
  private readonly i18n = I18n.create('game-common');

  private readonly levels = levelupCost as TalentLevelupCost[];

  constructor(private materials: MaterialInfoService, private logger: NGXLogger) {
    logger.info('loaded levelup cost', this.levels);
  }

  getLabel(talentId: number): string {
    return this.i18n.data('talent-type', talentId % 10);
  }

  requirement(item: Character, talents: UpgradableTalentInfo[]): MaterialRequireList[] {
    return [this.levelup(item, talents)];
  }

  private levelup(item: Character, talents: UpgradableTalentInfo[]): MaterialRequireList {
    const req = new MaterialRequireList();
    const {progress, plan} = item;
    for (const {id, materials} of talents) {
      const {domain: domainList, mob, boss, event} = materials;

      // talent level starts with 1 not 0, so should minus 1
      const start = Math.max(0, progress.talents[id] - 1);
      const goal = Math.max(start, plan.talents[id] - 1);
      const mark = getMark(plan, this.getLabel(id), `${start + 1}`, `${goal + 1}`);
      const domainLength = domainList.length;
      for (let i = start; i < goal; i++) {
        const cost = this.levels[i];
        if (!cost) {
          continue;
        }
        req.mark(mora.id, cost.mora, mark);
        const domainIndex = i % domainLength;
        const domain = domainList[domainIndex];
        this.materials.markGroup(req, domain, cost.domain, mark);
        this.materials.markGroup(req, mob, cost.mob, mark);
        req.mark(boss, cost.boss ?? 0, mark);
        req.mark(event, cost.event ?? 0, mark);
      }
    }
    return req;
  }
}

function getMark(plan: CharacterPlan, purpose: string, start: string, goal: string): RequireMark {
  return {type: 'character', id: plan.id, key: plan.id, purposeType: purpose, purpose, start, goal};
}
