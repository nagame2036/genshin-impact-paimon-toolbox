import {Injectable} from '@angular/core';
import {combineLatest, from, Observable, ReplaySubject, zip} from 'rxjs';
import {WeaponLevelupCost} from '../models/weapon-levelup-cost.model';
import {HttpClient} from '@angular/common/http';
import {CommonMaterialService} from '../../material/services/common-material.service';
import {AscensionLevel} from '../../character-and-gear/models/ascension-level.model';
import {ItemCostList} from '../models/item-cost-list.model';
import {map, reduce, switchMap, take} from 'rxjs/operators';
import {Ascension} from '../../character-and-gear/models/ascension.enum';
import {WeaponExpMaterialService} from '../../material/services/weapon-exp-material.service';
import {WeaponMaterialService} from '../../material/services/weapon-material.service';
import {WeaponAscensionCost} from '../models/weapon-ascension-cost.model';
import {PartyWeapon} from '../../character-and-gear/models/party-weapon.model';
import {WeaponPlan} from '../models/weapon-plan.model';
import {toAscensionLevel} from '../models/levelup-plan.model';
import {divideExps} from '../utils/divide-exps';

@Injectable({
  providedIn: 'root'
})
export class WeaponLevelupCostService {

  private levels = new ReplaySubject<WeaponLevelupCost>(1);

  private ascensions = new ReplaySubject<WeaponAscensionCost>(1);

  constructor(http: HttpClient, private exps: WeaponExpMaterialService, private domain: WeaponMaterialService,
              private common: CommonMaterialService) {
    http.get<WeaponLevelupCost>('assets/data/weapon-levelup-cost.json').subscribe(res => this.levels.next(res));
    http.get<WeaponAscensionCost>('assets/data/weapon-ascension-cost.json').subscribe(res => this.ascensions.next(res));
  }

  totalCost(plans: { plan: WeaponPlan, party: PartyWeapon }[]): Observable<ItemCostList> {
    return from(plans).pipe(
      switchMap(({plan, party}) => this.cost(party, toAscensionLevel(plan.levelup))),
      take(plans.length),
      reduce((acc, value) => acc.combine(value), new ItemCostList()),
      switchMap(cost => this.exps.items.pipe(map(
        exps => divideExps(cost.get(2), exps, cost)
      )))
    );
  }

  cost(weapon: PartyWeapon, goal: AscensionLevel): Observable<ItemCostList> {
    return combineLatest([this.ascension(weapon, goal.ascension), this.levelup(weapon, goal.level)]).pipe(
      map(([ascension, levelup]) => ascension.combine(levelup))
    );
  }

  private ascension(weapon: PartyWeapon, goal: Ascension): Observable<ItemCostList> {
    return zip(this.ascensions, this.domain.items, this.common.items).pipe(
      map(([ascensions, _, __]) => {
        const cost = new ItemCostList();
        const range = ascensions[weapon.rarity].slice(weapon.ascension, goal);
        range.forEach(({mora, domain, elite, common}) => {
          cost.add(0, mora);
          const domainItem = this.domain.getByGroupAndRarity(weapon.domain, domain.rarity);
          cost.add(domainItem.id, domain.amount);
          const eliteItem = this.common.getByGroupAndRarity(weapon.elite, elite.rarity);
          cost.add(eliteItem.id, elite.amount);
          const commonItem = this.common.getByGroupAndRarity(weapon.common, common.rarity);
          cost.add(commonItem.id, common.amount);
        });
        return cost;
      })
    );
  }

  private levelup(weapon: PartyWeapon, goal: number): Observable<ItemCostList> {
    return this.levels.pipe(map(levels => {
      const cost = new ItemCostList();
      const expAmount = levels[weapon.rarity].slice(weapon.level, goal).reduce((sum, curr) => sum + curr, 0);
      cost.add(2, expAmount);
      const mora = Math.floor(expAmount * .1);
      cost.add(0, mora);
      return cost;
    }));
  }

}
