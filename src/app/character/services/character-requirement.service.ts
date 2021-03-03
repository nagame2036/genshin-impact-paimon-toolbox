import {Injectable} from '@angular/core';
import {CharacterAscendCost} from '../models/character-ascend-cost.model';
import {MaterialInfoService} from '../../material/services/material-info.service';
import {Character} from '../models/character.model';
import {processExpBonus} from '../../game-common/models/levelup-exp-bonus.model';
import {characterExp, mora} from '../../material/models/mora-and-exp.model';
import {I18n} from '../../widget/models/i18n.model';
import {NGXLogger} from 'ngx-logger';
import {MaterialRequireList} from '../../material/collections/material-require-list';
import {ItemType} from '../../game-common/models/item-type.enum';
import {RequireMark} from '../../material/models/material-require-mark.model';
import {CharacterPlan} from '../models/character-plan.model';
import characterAscendCost from '../../../assets/data/characters/character-ascend-cost.json';
import characterLevelupCost from '../../../assets/data/characters/character-levelup-cost.json';

@Injectable({
  providedIn: 'root',
})
export class CharacterRequirementService {
  private readonly i18n = new I18n('game-common');

  private readonly ascensions = characterAscendCost as CharacterAscendCost[];

  /**
   * Stores the cost of exp per level for character level up.
   * @private
   */
  private readonly levels = characterLevelupCost as number[];

  readonly ascensionLabel = this.i18n.dict('ascension');

  readonly levelupLabel = this.i18n.dict('levelup');

  constructor(
    private materials: MaterialInfoService,
    private logger: NGXLogger,
  ) {}

  requirement(character: Character): MaterialRequireList {
    const subRequirements = [
      this.ascension(character),
      this.levelup(character),
    ];
    const req = new MaterialRequireList(subRequirements);
    this.logger.info('sent requirements', character, req);
    return req;
  }

  private ascension(character: Character): MaterialRequireList {
    const {info, progress, plan} = character;
    const {boss, gem, local, mob} = info.materials;
    const requirement = new MaterialRequireList();
    const label = this.ascensionLabel;
    const start = progress.ascension;
    const goal = plan.ascension;
    const mark = this.generateMark(plan, label, `★${start}`, `★${goal}`);
    for (const ascension of this.ascensions.slice(start, goal)) {
      requirement.mark(mora.id, ascension.mora, mark);
      if (boss) {
        requirement.mark(boss, ascension.boss, mark);
      }
      const gemItem = this.materials.get(gem, ascension.gem.rarity);
      requirement.mark(gemItem.id, ascension.gem.amount, mark);
      requirement.mark(local, ascension.local, mark);
      const mobItem = this.materials.get(mob, ascension.mob.rarity);
      requirement.mark(mobItem.id, ascension.mob.amount, mark);
    }
    return requirement;
  }

  private levelup(character: Character): MaterialRequireList {
    const {info, progress, plan} = character;
    const requirement = new MaterialRequireList();
    const label = this.levelupLabel;
    const start = progress.level;
    const goal = plan.level;
    const mark = this.generateMark(plan, label, `${start}`, `${goal}`);
    const expCostBase = this.levels
      .slice(start, goal)
      .reduce((sum, curr) => sum + curr, 0);
    const {moraCost, expCost} = processExpBonus(info, expCostBase, 0.2);
    requirement.mark(mora.id, moraCost, mark);
    requirement.mark(characterExp.id, expCost, mark);
    this.materials.processSpecialRequirement(requirement, mark);
    return requirement;
  }

  private generateMark(
    plan: CharacterPlan,
    purpose: string,
    start: string,
    goal: string,
  ): RequireMark {
    return {
      type: ItemType.CHARACTER,
      id: plan.id,
      key: plan.id,
      purposeType: this.levelupLabel,
      purpose,
      start,
      goal,
    };
  }
}
