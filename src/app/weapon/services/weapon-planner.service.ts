import {Injectable} from '@angular/core';
import {combineLatest, defer, iif, Observable, of, ReplaySubject, zip} from 'rxjs';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {first, map, switchMap, tap} from 'rxjs/operators';
import {WeaponPlan} from '../models/weapon-plan.model';
import {ItemList} from '../../inventory/models/item-list.model';
import {WeaponService} from './weapon.service';
import {WeaponLevelupCostService} from './weapon-levelup-cost.service';
import {PartyWeapon} from '../models/party-weapon.model';
import {activePlans} from '../../game-common/utils/party-plans';
import {MaterialRequireMarker} from '../../inventory/services/material-require-marker.service';
import {AscensionLevel} from '../../game-common/models/ascension-level.model';
import {I18n} from '../../widget/models/i18n.model';
import {ItemType} from '../../game-common/models/item-type.enum';
import {NGXLogger} from 'ngx-logger';

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

  private readonly type = ItemType.WEAPON;

  constructor(private database: NgxIndexedDBService, private weapons: WeaponService, private weaponLevelup: WeaponLevelupCostService,
              private marker: MaterialRequireMarker, private logger: NGXLogger) {
    this.database.getAll(this.storeName).subscribe(plans => {
      this.logger.info('loaded weapon plans', plans);
      this.#plans.next(plans);
    });
    combineLatest([this.plans, this.weapons.partyMap]).subscribe(([plans, party]) => {
      this.marker.clear(this.type);
      const active = activePlans(plans, party);
      this.logger.info('updated active plans', active);
      this.activePlans.next(active);
    });
  }

  getPlan(id: number): Observable<WeaponPlan> {
    return this.getActivePlan(id).pipe(
      first(),
      map(it => it.plan),
      tap(plan => this.logger.info('sent weapon plan', plan)),
    );
  }

  updatePlan(plan: WeaponPlan): void {
    zip(this.plans, this.database.update(this.storeName, plan)).subscribe(([plans, _]) => {
      this.logger.info('updated weapon plan', plan);
      const newPlans = plans.filter(it => it.id !== plan.id);
      newPlans.push(plan);
      this.#plans.next(newPlans);
    });
  }

  allPlansCost(): Observable<ItemList> {
    return this.activePlans.pipe(
      switchMap(it => iif(
        () => it.length === 0,
        of(new ItemList()),
        this.weaponLevelup.totalCost(it)
      )),
      tap(cost => this.logger.info('sent total cost of weapon plans', cost)),
    );
  }

  specificPlanCost(id: number): Observable<{ text: string, value: Observable<ItemList> }[]> {
    return this.getActivePlan(id).pipe(map(({party, plan}) => {
      this.logger.info('sent the cost of weapon plan', id);
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
