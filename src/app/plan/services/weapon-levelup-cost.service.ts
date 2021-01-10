import {Injectable} from '@angular/core';
import {combineLatest, from, Observable, ReplaySubject, zip} from 'rxjs';
import {WeaponLevelupCost} from '../models/weapon-levelup-cost.model';
import {HttpClient} from '@angular/common/http';
import {CommonMaterialService} from '../../material/services/common-material.service';
import {AscensionLevel} from '../../character-and-gear/models/ascension-level.model';
import {ItemList} from '../../material/models/item-list.model';
import {map, reduce, switchMap, take} from 'rxjs/operators';
import {Ascension} from '../../character-and-gear/models/ascension.type';
import {WeaponMaterialService} from '../../material/services/weapon-material.service';
import {WeaponAscensionCost} from '../models/weapon-ascension-cost.model';
import {PartyWeapon} from '../../weapon/models/party-weapon.model';
import {WeaponPlan} from '../models/weapon-plan.model';
import {processExpBonus} from '../../character-and-gear/models/levelup-exp-bonus.model';
import {mora, weaponExp} from '../../material/models/mora-and-exp.model';

@Injectable({
  providedIn: 'root'
})
export class WeaponLevelupCostService {

  private levels = new ReplaySubject<WeaponLevelupCost>(1);

  private ascensions = new ReplaySubject<WeaponAscensionCost>(1);

  constructor(http: HttpClient, private domain: WeaponMaterialService, private common: CommonMaterialService) {
    http.get<WeaponLevelupCost>('assets/data/weapon-levelup-cost.json').subscribe(res => this.levels.next(res));
    http.get<WeaponAscensionCost>('assets/data/weapon-ascension-cost.json').subscribe(res => this.ascensions.next(res));
  }

  totalCost(plans: { plan: WeaponPlan, party: PartyWeapon }[]): Observable<ItemList> {
    return from(plans).pipe(
      switchMap(({plan, party}) => this.cost(party, new AscensionLevel(plan.ascension, plan.level))),
      take(plans.length),
      reduce((acc, value) => acc.combine(value), new ItemList())
    );
  }

  cost(weapon: PartyWeapon, goal: AscensionLevel): Observable<ItemList> {
    return combineLatest([this.ascension(weapon, goal.ascension), this.levelup(weapon, goal.level)]).pipe(
      map(([ascension, levelup]) => ascension.combine(levelup))
    );
  }

  private ascension(weapon: PartyWeapon, goal: Ascension): Observable<ItemList> {
    return zip(this.ascensions, this.domain.items, this.common.items).pipe(
      map(([ascensions, _, __]) => {
        const cost = new ItemList();
        const range = ascensions[weapon.rarity].slice(weapon.ascension, goal);
        range.forEach(({mora: moraCost, domain, elite, common}) => {
          cost.change(mora.id, moraCost);
          const domainItem = this.domain.getByGroupAndRarity(weapon.domain, domain.rarity);
          cost.change(domainItem.id, domain.amount);
          const eliteItem = this.common.getByGroupAndRarity(weapon.elite, elite.rarity);
          cost.change(eliteItem.id, elite.amount);
          const commonItem = this.common.getByGroupAndRarity(weapon.common, common.rarity);
          cost.change(commonItem.id, common.amount);
        });
        return cost;
      })
    );
  }

  private levelup(weapon: PartyWeapon, goal: number): Observable<ItemList> {
    return this.levels.pipe(map(levels => {
      const cost = new ItemList();
      const expAmount = levels[weapon.rarity].slice(weapon.level, goal).reduce((sum, curr) => sum + curr, 0);
      const {mora: moraCost, exp} = processExpBonus(weapon, expAmount * .1, v => v * 10);
      cost.change(mora.id, moraCost);
      cost.change(weaponExp.id, exp);
      return cost;
    }));
  }

}
