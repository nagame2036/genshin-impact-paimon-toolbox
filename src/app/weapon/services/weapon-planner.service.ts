import {Injectable} from '@angular/core';
import {combineLatest, defer, iif, Observable, of, ReplaySubject, zip} from 'rxjs';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {first, map, switchMap} from 'rxjs/operators';
import {WeaponPlan} from '../models/weapon-plan.model';
import {ItemList} from '../../inventory/models/item-list.model';
import {WeaponService} from './weapon.service';
import {WeaponLevelupCostService} from './weapon-levelup-cost.service';
import {PartyWeapon} from '../models/party-weapon.model';
import {activePlans} from '../../game-common/utils/party-plans';
import {MaterialRequireMarker} from '../../inventory/services/material-require-marker.service';
import {AscensionLevel} from '../../game-common/models/ascension-level.model';
import {I18n} from '../../widget/models/i18n.model';

type ActivePlan = { plan: WeaponPlan, party: PartyWeapon };

@Injectable({
  providedIn: 'root'
})
export class WeaponPlanner {

  i18n = new I18n('game-common');

  private storeName = 'weapon-plans';

  #plans = new ReplaySubject<WeaponPlan[]>(1);

  plans = this.#plans.asObservable();

  activePlans = new ReplaySubject<ActivePlan[]>(1);

  constructor(private database: NgxIndexedDBService, private weapons: WeaponService, private weaponLevelup: WeaponLevelupCostService,
              private marker: MaterialRequireMarker) {
    this.database.getAll(this.storeName).subscribe(res => this.#plans.next(res));
    combineLatest([this.plans, this.weapons.partyMap]).subscribe(([plans, party]) => {
      this.activePlans.next(activePlans(plans, party));
    });
    this.marker.cleared.pipe(switchMap(_ => this.activePlans))
      .subscribe(plans => this.activePlans.next(plans));
  }

  getPlan(id: number): Observable<WeaponPlan> {
    return this.getActivePlan(id).pipe(first(), map(it => it.plan));
  }

  updatePlan(plan: WeaponPlan): void {
    zip(this.plans, this.database.update(this.storeName, plan)).subscribe(([plans, _]) => {
      this.marker.clear();
      const newPlans = plans.filter(it => it.id !== plan.id);
      newPlans.push(plan);
      this.#plans.next(newPlans);
    });
  }

  allPlansCost(): Observable<ItemList> {
    return this.activePlans.pipe(switchMap(it => iif(
      () => it.length === 0,
      of(new ItemList()),
      this.weaponLevelup.totalCost(it)
    )));
  }

  specificPlanCost(id: number): Observable<{ text: string, value: Observable<ItemList> }[]> {
    return this.getActivePlan(id).pipe(map(({party, plan}) => {
      const levelup = this.weaponLevelup.cost(party, new AscensionLevel(plan.ascension, plan.level), false);
      return [
        {text: this.i18n.module('total-requirement'), value: levelup},
      ];
    }));
  }

  private getActivePlan(id: number): Observable<ActivePlan> {
    return this.activePlans.pipe(switchMap(plans => {
      const index = plans.findIndex(it => it.plan.id === id);
      return iif(() => index !== -1, defer(() => of(plans[index])));
    }));
  }
}
