import {Injectable} from '@angular/core';
import {forkJoin, Observable, ReplaySubject} from 'rxjs';
import {WeaponLevelupCost} from '../models/weapon-levelup-cost.model';
import {HttpClient} from '@angular/common/http';
import {MaterialInfoService} from '../../material/services/material-info.service';
import {first, map, tap} from 'rxjs/operators';
import {WeaponAscensionCost} from '../models/weapon-ascension-cost.model';
import {Weapon} from '../models/weapon.model';
import {processExpBonus} from '../../game-common/models/levelup-exp-bonus.model';
import {mora, weaponExp} from '../../material/models/mora-and-exp.model';
import {I18n} from '../../widget/models/i18n.model';
import {ItemType} from '../../game-common/models/item-type.enum';
import {NGXLogger} from 'ngx-logger';
import {MaterialRequireList} from '../../material/collections/material-require-list';
import {RequireMark} from '../../material/models/material-require-mark.model';
import {WeaponPlan} from '../models/weapon-plan.model';

@Injectable({
  providedIn: 'root',
})
export class WeaponRequirementService {
  private readonly i18n = new I18n('game-common');

  private readonly prefix = 'assets/data/weapons';

  private ascensions = new ReplaySubject<WeaponAscensionCost>(1);

  /**
   * Stores the cost of exp per level for weapon level up.
   * @private
   */
  private levels = new ReplaySubject<WeaponLevelupCost>(1);

  readonly ascensionLabel = this.i18n.dict('ascension');

  readonly levelupLabel = this.i18n.dict('levelup');

  constructor(
    http: HttpClient,
    private materials: MaterialInfoService,
    private logger: NGXLogger,
  ) {
    http
      .get<WeaponAscensionCost>(`${this.prefix}/weapon-ascension-cost.json`)
      .subscribe(data => {
        this.logger.info('loaded weapon ascension cost data', data);
        this.ascensions.next(data);
      });
    http
      .get<WeaponLevelupCost>(`${this.prefix}/weapon-levelup-cost.json`)
      .subscribe(data => {
        this.logger.info('loaded weapon levelup cost data', data);
        this.levels.next(data);
      });
  }

  requirement(weapon: Weapon): Observable<MaterialRequireList> {
    const subRequirements = [this.ascension(weapon), this.levelup(weapon)];
    return forkJoin(subRequirements).pipe(
      map(requirements => new MaterialRequireList(requirements)),
      tap(req => this.logger.info('sent requirements of weapon', weapon, req)),
    );
  }

  private ascension(weapon: Weapon): Observable<MaterialRequireList> {
    return this.ascensions.pipe(
      first(),
      map(ascensions => {
        const {progress, plan} = weapon;
        const {rarity, materials} = weapon.info;
        const {domain, elite, mob} = materials;
        const requirement = new MaterialRequireList();
        const label = this.ascensionLabel;
        const start = progress.ascension;
        const end = plan.ascension;
        const mark = this.generateMark(plan, label, `★${start}`, `★${end}`);
        const ascensionSlice = ascensions[rarity].slice(start, end);
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
      }),
    );
  }

  private levelup(weapon: Weapon): Observable<MaterialRequireList> {
    return this.levels.pipe(
      first(),
      map(levels => {
        const {info, progress, plan} = weapon;
        const requirement = new MaterialRequireList();
        const label = this.levelupLabel;
        const start = progress.level;
        const end = plan.level;
        const mark = this.generateMark(plan, label, `${start}`, `${end}`);
        const expAmount = levels[info.rarity]
          .slice(start, end)
          .reduce((sum, curr) => sum + curr, 0);
        const {moraCost, expCost} = processExpBonus(info, expAmount, 0.1);
        requirement.mark(mora.id, moraCost, mark);
        requirement.mark(weaponExp.id, expCost, mark);
        this.materials.processSpecialRequirement(requirement, mark);
        return requirement;
      }),
    );
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
