import {Injectable} from '@angular/core';
import {WeaponLevelupCost} from '../models/weapon-levelup-cost.model';
import {MaterialInfoService} from '../../material/services/material-info.service';
import {WeaponAscendCost} from '../models/weapon-ascend-cost.model';
import {Weapon} from '../models/weapon.model';
import {processExpBonus} from '../../game-common/models/levelup-exp-bonus.model';
import {mora, weaponExp} from '../../material/models/mora-and-exp.model';
import {I18n} from '../../widget/models/i18n.model';
import {ItemType} from '../../game-common/models/item-type.enum';
import {NGXLogger} from 'ngx-logger';
import {MaterialRequireList} from '../../material/collections/material-require-list';
import {RequireMark} from '../../material/models/material-require-mark.model';
import {WeaponPlan} from '../models/weapon-plan.model';
import weaponAscendCost from '../../../data/weapons/weapon-ascend-cost.json';
import weaponLevelupCost from '../../../data/weapons/weapon-levelup-cost.json';

@Injectable({
  providedIn: 'root',
})
export class WeaponRequirementService {
  private readonly i18n = new I18n('game-common');

  private ascensions = weaponAscendCost as WeaponAscendCost;

  /**
   * Stores the cost of exp per level for weapon level up.
   * @private
   */
  private levels = weaponLevelupCost as WeaponLevelupCost;

  readonly ascensionLabel = this.i18n.dict('ascension');

  readonly levelupLabel = this.i18n.dict('levelup');

  constructor(
    private materials: MaterialInfoService,
    private logger: NGXLogger,
  ) {}

  requirement(weapon: Weapon): MaterialRequireList {
    const subRequirements = [this.ascension(weapon), this.levelup(weapon)];
    const req = new MaterialRequireList(subRequirements);
    this.logger.info('sent requirements of weapon', weapon, req);
    return req;
  }

  private ascension(weapon: Weapon): MaterialRequireList {
    const {progress, plan} = weapon;
    const {rarity, materials} = weapon.info;
    const {domain, elite, mob} = materials;
    const requirement = new MaterialRequireList();
    const label = this.ascensionLabel;
    const start = progress.ascension;
    const end = plan.ascension;
    const mark = this.generateMark(plan, label, `★${start}`, `★${end}`);
    const ascensionSlice = this.ascensions[rarity].slice(start, end);
    for (const ascension of ascensionSlice) {
      const {
        mora: moraCost,
        domain: domainCost,
        elite: eliteCost,
        mob: mobCost,
      } = ascension;
      requirement.mark(mora.id, moraCost, mark);
      const domainItem = this.materials.get(domain, domainCost.rarity);
      requirement.mark(domainItem.id, domainCost.amount, mark);
      const eliteItem = this.materials.get(elite, eliteCost.rarity);
      requirement.mark(eliteItem.id, eliteCost.amount, mark);
      const mobItem = this.materials.get(mob, mobCost.rarity);
      requirement.mark(mobItem.id, mobCost.amount, mark);
    }
    return requirement;
  }

  private levelup(weapon: Weapon): MaterialRequireList {
    const {info, progress, plan} = weapon;
    const requirement = new MaterialRequireList();
    const label = this.levelupLabel;
    const start = progress.level;
    const end = plan.level;
    const mark = this.generateMark(plan, label, `${start}`, `${end}`);
    const expAmount = this.levels[info.rarity]
      .slice(start, end)
      .reduce((sum, curr) => sum + curr, 0);
    const {moraCost, expCost} = processExpBonus(info, expAmount, 0.1);
    requirement.mark(mora.id, moraCost, mark);
    requirement.mark(weaponExp.id, expCost, mark);
    this.materials.processSpecialRequirement(requirement, mark);
    return requirement;
  }

  private generateMark(
    plan: WeaponPlan,
    purpose: string,
    start: string,
    goal: string,
  ): RequireMark {
    return {
      type: ItemType.WEAPON,
      id: plan.weaponId,
      key: plan.id,
      purposeType: this.levelupLabel,
      purpose,
      start,
      goal,
    };
  }
}
