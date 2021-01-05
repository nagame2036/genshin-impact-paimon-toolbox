import {Injectable} from '@angular/core';
import {combineLatest, defer, iif, Observable, of, ReplaySubject, zip} from 'rxjs';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {map, switchMap} from 'rxjs/operators';
import {getLevelupPlan, toAscensionLevel} from '../models/levelup-plan.model';
import {WeaponPlan} from '../models/weapon-plan.model';
import {ItemList} from '../../material/models/item-list.model';
import {WeaponService} from '../../character-and-gear/services/weapon.service';
import {WeaponLevelupCostService} from './weapon-levelup-cost.service';
import {PartyWeapon} from '../../character-and-gear/models/party-weapon.model';
import {activePlans} from '../utils/party-plans';
import {WeaponPlanDetail} from '../models/weapon-plan-detail.model';

@Injectable({
  providedIn: 'root'
})
export class WeaponPlanner {

  private storeName = 'weapon-plans';

  #plans = new ReplaySubject<WeaponPlan[]>(1);

  plans = this.#plans.asObservable();

  activePlans: Observable<{ plan: WeaponPlan, party: PartyWeapon }[]>;

  constructor(private database: NgxIndexedDBService, private weapons: WeaponService, private weaponLevelup: WeaponLevelupCostService) {
    this.database.getAll(this.storeName).subscribe(res => this.#plans.next(res));
    this.activePlans = combineLatest([this.plans, this.weapons.partyMap]).pipe(
      map(([plans, party]) => activePlans(plans, party))
    );
  }

  getPlan(id: number): Observable<WeaponPlan> {
    return this.activePlans.pipe(switchMap(plans => {
      const index = plans.findIndex(it => it.plan.id === id);
      return iif(() => index !== -1, defer(() => of(plans[index].plan)));
    }));
  }

  updatePlan(detail: WeaponPlanDetail): void {
    const plan = this.getPlanDTO(detail);
    zip(this.plans, this.database.update(this.storeName, plan)).subscribe(([plans, _]) => {
      const newPlans = plans.filter(it => it.id !== detail.id);
      newPlans.push(plan);
      this.#plans.next(newPlans);
    });
  }

  plansCost(): Observable<ItemList> {
    return this.activePlans.pipe(switchMap(it => iif(
      () => it.length === 0,
      of(new ItemList()),
      this.weaponLevelup.totalCost(it)
    )));
  }

  getPlanDTO(detail: WeaponPlanDetail): WeaponPlan {
    const {id, ascension, level} = detail;
    const levelup = getLevelupPlan(ascension, level);
    return {id, levelup};
  }

  getPlanDetail(plan: WeaponPlan): WeaponPlanDetail {
    const {id, levelup} = plan;
    const {ascension, level} = toAscensionLevel(levelup);
    return {id, ascension, level};
  }
}
