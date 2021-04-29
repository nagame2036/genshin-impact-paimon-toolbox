import {Injectable} from '@angular/core';
import {WeaponLevelupCost} from '../models/weapon-levelup-cost.model';
import {MaterialInfoService} from '../../material/services/material-info.service';
import {WeaponAscendCost} from '../models/weapon-ascend-cost.model';
import {Weapon} from '../models/weapon.model';
import {processExpBonus} from '../../game-common/models/levelup-exp-bonus.model';
import {mora, weaponExp} from '../../material/models/mora-and-exp.model';
import {I18n} from '../../widget/models/i18n.model';
import {NGXLogger} from 'ngx-logger';
import {MaterialRequireList} from '../../material/collections/material-require-list';
import {RequireMark} from '../../material/models/material-require-mark.model';
import {WeaponPlan} from '../models/weapon-plan.model';
import ascendCost from '../../../data/weapon/weapon-ascend-cost.json';
import levelupCost from '../../../data/weapon/weapon-levelup-cost.json';

@Injectable({
  providedIn: 'root',
})
export class WeaponRequirementService {
  readonly i18n = I18n.create('game-common');

  readonly ascendLabel = this.i18n.dict('ascend');

  readonly levelupLabel = this.i18n.dict('levelup');

  private ascensions = ascendCost as WeaponAscendCost;
  /**
   * Stores the cost of exp per level for weapon level up.
   * @private
   */
  private levels = levelupCost as WeaponLevelupCost;

  constructor(private materials: MaterialInfoService, private logger: NGXLogger) {
    logger.info('loaded ascend cost', this.ascensions);
    logger.info('loaded levelup cost', this.levels);
  }

  requirement(item: Weapon): MaterialRequireList[] {
    return [this.ascend(item), this.levelup(item)];
  }

  private ascend({info, progress, plan}: Weapon): MaterialRequireList {
    const req = new MaterialRequireList();
    const {rarity, materials} = info;
    const {domain, elite, mob} = materials;
    const start = progress.ascension;
    const end = plan.ascension;
    const mark = this.getMark(plan, this.ascendLabel, `★${start}`, `★${end}`);
    const costs = this.ascensions[rarity]?.slice(start, end) ?? [];
    for (const cost of costs) {
      req.mark(mora.id, cost.mora, mark);
      this.materials.markGroup(req, domain, cost.domain, mark);
      this.materials.markGroup(req, elite, cost.elite, mark);
      this.materials.markGroup(req, mob, cost.mob, mark);
    }
    return req;
  }

  private levelup({info, progress, plan}: Weapon): MaterialRequireList {
    const req = new MaterialRequireList();
    const start = progress.level;
    const end = plan.level;
    const mark = this.getMark(plan, this.levelupLabel, `${start}`, `${end}`);
    const levels = this.levels[info.rarity]?.slice(start, end) ?? [];
    const expAmount = levels.reduce((sum, curr) => sum + curr, 0);
    const {moraCost, expCost} = processExpBonus(info, expAmount, 0.1);
    req.mark(mora.id, moraCost, mark);
    req.mark(weaponExp.id, expCost, mark);
    this.materials.processSpecialRequirement(req, mark);
    return req;
  }

  private getMark(plan: WeaponPlan, purpose: string, start: string, goal: string): RequireMark {
    const purposeType = this.levelupLabel;
    return {type: 'weapon', id: plan.infoId, key: plan.id, purposeType, purpose, start, goal};
  }
}
