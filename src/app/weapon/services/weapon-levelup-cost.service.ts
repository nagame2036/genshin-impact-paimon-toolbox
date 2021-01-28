import {Injectable} from '@angular/core';
import {combineLatest, from, Observable, ReplaySubject, zip} from 'rxjs';
import {WeaponLevelupCost} from '../models/weapon-levelup-cost.model';
import {HttpClient} from '@angular/common/http';
import {EnemiesMaterialService} from '../../inventory/services/enemies-material.service';
import {AscensionLevel} from '../../game-common/models/ascension-level.model';
import {ItemList} from '../../inventory/models/item-list.model';
import {map, mergeMap, reduce, take, tap} from 'rxjs/operators';
import {Ascension} from '../../game-common/models/ascension.type';
import {WeaponAscensionMaterialService} from '../../inventory/services/weapon-ascension-material.service';
import {WeaponAscensionCost} from '../models/weapon-ascension-cost.model';
import {PartyWeapon} from '../models/party-weapon.model';
import {WeaponPlan} from '../models/weapon-plan.model';
import {processExpBonus} from '../../game-common/models/levelup-exp-bonus.model';
import {mora, weaponExp} from '../../inventory/models/mora-and-exp.model';
import {MaterialRequireMarker} from '../../inventory/services/material-require-marker.service';
import {I18n} from '../../widget/models/i18n.model';
import {ItemType} from '../../game-common/models/item-type.enum';
import {WeaponExpMaterialService} from '../../inventory/services/weapon-exp-material.service';
import {NGXLogger} from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class WeaponLevelupCostService {

  i18n = new I18n('game-common');

  private ascensions = new ReplaySubject<WeaponAscensionCost>(1);

  /**
   * Stores the cost of exp per level for weapon level up.
   * @private
   */
  private levels = new ReplaySubject<WeaponLevelupCost>(1);

  private readonly ascensionLabel = this.i18n.dict('ascension');

  private readonly levelupLabel = this.i18n.dict('levelup');

  constructor(http: HttpClient, private domain: WeaponAscensionMaterialService, private enemies: EnemiesMaterialService,
              private exps: WeaponExpMaterialService, private marker: MaterialRequireMarker, private logger: NGXLogger) {
    http.get<WeaponAscensionCost>('assets/data/weapons/weapon-ascension-cost.json').subscribe(data => {
      this.logger.info('loaded weapon ascension cost data', data);
      this.ascensions.next(data);
    });
    http.get<WeaponLevelupCost>('assets/data/weapons/weapon-levelup-cost.json').subscribe(data => {
      this.logger.info('loaded character levelup cost data', data);
      this.levels.next(data);
    });
  }

  totalCost(plans: { plan: WeaponPlan, party: PartyWeapon }[]): Observable<ItemList> {
    return from(plans).pipe(
      mergeMap(({plan, party}) => this.cost(party, new AscensionLevel(plan.ascension, plan.level), true)),
      take(plans.length),
      reduce((acc, value) => acc.combine(value), new ItemList()),
      tap(cost => this.logger.info('sent total cost of weapon plans', cost)),
    );
  }

  cost(weapon: PartyWeapon, goal: AscensionLevel, mark: boolean = false): Observable<ItemList> {
    return combineLatest([this.ascension(weapon, goal.ascension, mark), this.levelup(weapon, goal.level, mark)]).pipe(
      map(([ascension, levelup]) => ascension.combine(levelup))
    );
  }

  private ascension(weapon: PartyWeapon, goal: Ascension, mark: boolean): Observable<ItemList> {
    return zip(this.ascensions, this.domain.items, this.enemies.items).pipe(map(([ascensions]) => {
      const cost = new ItemList();
      const range = ascensions[weapon.rarity].slice(weapon.ascension, goal);
      range.forEach(({mora: moraCost, domain, elite, mob}) => {
        cost.change(mora.id, moraCost);
        const domainItem = this.domain.getByGroupAndRarity(weapon.domain, domain.rarity);
        cost.change(domainItem.id, domain.amount);
        const eliteItem = this.enemies.getByGroupAndRarity(weapon.elite, elite.rarity);
        cost.change(eliteItem.id, elite.amount);
        const mobItem = this.enemies.getByGroupAndRarity(weapon.mob, mob.rarity);
        cost.change(mobItem.id, mob.amount);
      });
      return this.mark(mark, weapon, cost, this.ascensionLabel, [weapon.ascension, goal].map(it => `★${it}`));
    }));
  }

  private levelup(weapon: PartyWeapon, goal: number, mark: boolean): Observable<ItemList> {
    return this.levels.pipe(map(levels => {
      const cost = new ItemList();
      const expAmount = levels[weapon.rarity].slice(weapon.level, goal).reduce((sum, curr) => sum + curr, 0);
      const {mora: moraCost, exp} = processExpBonus(weapon, expAmount * .1, v => v * 10);
      cost.change(mora.id, moraCost);
      cost.change(weaponExp.id, exp);
      const result = this.exps.splitExpNeed(cost);
      return this.mark(mark, weapon, result, this.levelupLabel, [weapon.level.toString(), goal.toString()]);
    }));
  }

  private mark(mark: boolean, party: PartyWeapon, cost: ItemList, purpose: string, [start, goal]: string[]): ItemList {
    if (mark) {
      const type = ItemType.WEAPON;
      this.marker.mark(mark, cost, type, party.id, party.key ?? -1, purpose, [start, goal]);
    }
    return cost;
  }

}
