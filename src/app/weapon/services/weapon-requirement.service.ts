import {Injectable} from '@angular/core';
import {combineLatest, Observable, ReplaySubject, zip} from 'rxjs';
import {WeaponLevelupCost} from '../models/weapon-levelup-cost.model';
import {HttpClient} from '@angular/common/http';
import {EnemyMaterialService} from '../../material/services/enemy-material.service';
import {MaterialList} from '../../material/models/material-list.model';
import {map, tap} from 'rxjs/operators';
import {WeaponAscensionMaterialService} from '../../material/services/weapon-ascension-material.service';
import {WeaponAscensionCost} from '../models/weapon-ascension-cost.model';
import {Weapon} from '../models/weapon.model';
import {processExpBonus} from '../../game-common/models/levelup-exp-bonus.model';
import {mora, weaponExp} from '../../material/models/mora-and-exp.model';
import {I18n} from '../../widget/models/i18n.model';
import {ItemType} from '../../game-common/models/item-type.enum';
import {WeaponExpMaterialService} from '../../material/services/weapon-exp-material.service';
import {NGXLogger} from 'ngx-logger';
import {MaterialRequireList} from '../../material/models/material-require-list.model';

@Injectable({
  providedIn: 'root'
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

  constructor(http: HttpClient, private exps: WeaponExpMaterialService, private domain: WeaponAscensionMaterialService,
              private enemies: EnemyMaterialService, private logger: NGXLogger) {
    http.get<WeaponAscensionCost>(`${this.prefix}/weapon-ascension-cost.json`).subscribe(data => {
      this.logger.info('loaded weapon ascension cost data', data);
      this.ascensions.next(data);
    });
    http.get<WeaponLevelupCost>(`${this.prefix}/weapon-levelup-cost.json`).subscribe(data => {
      this.logger.info('loaded character levelup cost data', data);
      this.levels.next(data);
    });
  }

  totalRequirements(weapons: Weapon[]): Observable<MaterialRequireList> {
    const requirementObs = weapons.map(weapon => this.requirement(weapon));
    return combineLatest(requirementObs).pipe(
      map(requirements => new MaterialRequireList(requirements)),
      tap(requirements => this.logger.info('sent total material requirements of all weapons', requirements)),
    );
  }

  requirement(weapon: Weapon): Observable<MaterialRequireList> {
    const subRequirements = [
      this.ascension(weapon),
      this.levelup(weapon),
    ];
    return combineLatest(subRequirements).pipe(
      map((requirements) => new MaterialRequireList(requirements)),
      tap(requirements => this.logger.info('sent material requirements of weapon', weapon, requirements)),
    );
  }

  private ascension({info: {id, rarity, materials}, progress, plan}: Weapon): Observable<MaterialRequireList> {
    return zip(this.ascensions, this.domain.items, this.enemies.items).pipe(map(([ascensions]) => {
      const {domain, elite, mob} = materials;
      const requirement = new MaterialRequireList();
      const cost = new MaterialList();
      const ascensionSlice = ascensions[rarity].slice(progress.ascension, plan.ascension);
      for (const ascension of ascensionSlice) {
        const {mora: moraCost, domain: domainCost, elite: eliteCost, mob: mobCost} = ascension;
        cost.change(mora.id, moraCost);
        const domainItem = this.domain.getByGroupAndRarity(domain, domainCost.rarity);
        cost.change(domainItem.id, domainCost.amount);
        const eliteItem = this.enemies.getByGroupAndRarity(elite, eliteCost.rarity);
        cost.change(eliteItem.id, eliteCost.amount);
        const mobItem = this.enemies.getByGroupAndRarity(mob, mobCost.rarity);
        cost.change(mobItem.id, mobCost.amount);
      }
      const key = progress.id;
      return requirement.mark(cost, ItemType.WEAPON, id, key, this.ascensionLabel, [progress, plan].map(it => `★${it.ascension}`));
    }));
  }

  private levelup({info, progress, plan}: Weapon): Observable<MaterialRequireList> {
    return this.levels.pipe(map(levels => {
      const {id, rarity} = info;
      const requirement = new MaterialRequireList();
      const cost = new MaterialList();
      const expAmount = levels[rarity].slice(progress.level, plan.level).reduce((sum, curr) => sum + curr);
      const {mora: moraCost, exp: expCost} = processExpBonus(info, expAmount, v => v * .1);
      cost.change(mora.id, moraCost);
      cost.change(weaponExp.id, expCost);
      this.exps.splitExpNeed(cost);
      const key = progress.id;
      return requirement.mark(cost, ItemType.WEAPON, id, key, this.levelupLabel, [progress, plan].map(it => it.level.toString()));
    }));
  }
}
