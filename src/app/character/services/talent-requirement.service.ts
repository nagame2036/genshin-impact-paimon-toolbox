import {Injectable} from '@angular/core';
import {TalentLevelupCost} from '../models/talent-levelup-cost.model';
import {MaterialInfoService} from '../../material/services/material-info.service';
import {mora} from '../../material/models/mora-and-exp.model';
import {I18n} from '../../widget/models/i18n.model';
import {NGXLogger} from 'ngx-logger';
import {Character} from '../models/character.model';
import {MaterialRequireList} from '../../material/collections/material-require-list';
import {ItemType} from '../../game-common/models/item-type.enum';
import {TalentInfo} from '../models/talent-info.model';
import {RequireMark} from '../../material/models/material-require-mark.model';
import {CharacterPlan} from '../models/character-plan.model';
import talentLevelupCost from '../../../data/characters/talent-levelup-cost.json';

@Injectable({
  providedIn: 'root',
})
export class TalentRequirementService {
  private readonly i18n = new I18n('game-common');

  private readonly levels = talentLevelupCost as TalentLevelupCost[];

  constructor(
    private materials: MaterialInfoService,
    private logger: NGXLogger,
  ) {}

  requirement(
    character: Character,
    talents: TalentInfo[],
  ): MaterialRequireList {
    const subRequirements = [this.levelup(character, talents)];
    const req = new MaterialRequireList(subRequirements);
    this.logger.info('sent requirements', talents, req);
    return req;
  }

  getLabel(talentId: number): string {
    return this.i18n.dict(`talent-types.${talentId % 10}`);
  }

  private levelup(
    {progress, plan}: Character,
    talents: TalentInfo[],
  ): MaterialRequireList {
    const requirement = new MaterialRequireList();
    for (const {id, materials} of talents) {
      if (!materials) {
        continue;
      }
      const {domain, mob, boss, event} = materials;

      // talent level starts with 1 not 0, so should minus 1
      const start = Math.max(0, progress.talents[id] - 1);
      const goal = Math.max(start, plan.talents[id] - 1);
      const label = this.getLabel(id);
      const mark = generateMark(plan, label, start, goal);
      const domainLength = domain.length;
      for (let i = start; i < goal; i++) {
        const cost = this.levels[i];
        requirement.mark(mora.id, cost.mora, mark);
        const domainGroupIndex = i % domainLength;
        const domainGroup = domain[domainGroupIndex];
        const domainItem = this.materials.get(domainGroup, cost.domain.rarity);
        requirement.mark(domainItem.id, cost.domain.amount, mark);
        const mobItem = this.materials.get(mob, cost.mob.rarity);
        requirement.mark(mobItem.id, cost.mob.amount, mark);
        if (cost.boss) {
          requirement.mark(boss, cost.boss, mark);
        }
        if (cost.event) {
          requirement.mark(event, cost.event, mark);
        }
      }
    }
    return requirement;
  }
}

function generateMark(
  plan: CharacterPlan,
  purpose: string,
  start: number,
  goal: number,
): RequireMark {
  return {
    type: ItemType.CHARACTER,
    id: plan.id,
    key: plan.id,
    purposeType: purpose,
    purpose,
    start: (start + 1).toString(),
    goal: (goal + 1).toString(),
  };
}
