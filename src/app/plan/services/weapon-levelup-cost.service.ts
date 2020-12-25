import {Injectable} from '@angular/core';
import {Observable, ReplaySubject, zip} from 'rxjs';
import {WeaponLevelupCost} from '../models/weapon-levelup-cost.model';
import {HttpClient} from '@angular/common/http';
import {CommonMaterialService} from '../../material/services/common-material.service';
import {AscensionLevel} from '../../character-and-gear/models/ascension-level.model';
import {ItemCostList} from '../models/item-cost-list.model';
import {map} from 'rxjs/operators';
import {Ascension} from '../../character-and-gear/models/ascension.enum';
import {WeaponExpMaterialService} from '../../material/services/weapon-exp-material.service';
import {WeaponMaterialService} from '../../material/services/weapon-material.service';
import {WeaponAscensionCost} from '../models/weapon-ascension-cost.model';
import {PartyWeapon} from '../../character-and-gear/models/party-weapon.model';

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

  cost(weapon: PartyWeapon, to: AscensionLevel): Observable<ItemCostList> {
    return zip(this.ascension(weapon, to.ascension), this.levelup(weapon, to.level)).pipe(
      map(([ascension, levelup]) => ascension.combine(levelup))
    );
  }

  private ascension(weapon: PartyWeapon, to: Ascension): Observable<ItemCostList> {
    const cost = new ItemCostList();
    return zip(this.ascensions, this.domain.items, this.common.items).pipe(
      map(([ascensions, _, __]) => {
        ascensions[weapon.rarity].slice(weapon.ascension, to).forEach(({mora, domain, elite, common}) => {
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

  private levelup(weapon: PartyWeapon, to: number): Observable<ItemCostList> {
    const cost = new ItemCostList();
    return this.levels.pipe(map(levels => {
      const expAmount = levels[weapon.rarity].slice(weapon.level, to).reduce((sum, curr) => sum + curr, 0);
      cost.add(2, expAmount);
      const mora = Math.floor(expAmount * .1);
      cost.add(0, mora);
      return cost;
    }));
  }

}
