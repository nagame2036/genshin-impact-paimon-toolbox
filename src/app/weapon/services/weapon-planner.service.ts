import {Injectable} from '@angular/core';
import {combineLatest, defer, iif, Observable, of, ReplaySubject, zip} from 'rxjs';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {first, switchMap} from 'rxjs/operators';
import {WeaponPlan} from '../models/weapon-plan.model';
import {ItemList} from '../../material/models/item-list.model';
import {WeaponService} from './weapon.service';
import {WeaponLevelupCostService} from './weapon-levelup-cost.service';
import {PartyWeapon} from '../models/party-weapon.model';
import {activePlans} from '../../game-common/utils/party-plans';
import {MaterialCostMarker} from '../../material/services/material-cost-marker.service';

@Injectable({
  providedIn: 'root'
})
export class WeaponPlanner {

  private storeName = 'weapon-plans';

  #plans = new ReplaySubject<WeaponPlan[]>(1);

  plans = this.#plans.asObservable();

  activePlans = new ReplaySubject<{ plan: WeaponPlan, party: PartyWeapon }[]>(1);

  constructor(private database: NgxIndexedDBService, private weapons: WeaponService, private weaponLevelup: WeaponLevelupCostService,
              private marker: MaterialCostMarker) {
    this.database.getAll(this.storeName).subscribe(res => this.#plans.next(res));
    combineLatest([this.plans, this.weapons.partyMap]).subscribe(([plans, party]) => {
      this.activePlans.next(activePlans(plans, party));
    });
  }

  getPlan(id: number): Observable<WeaponPlan> {
    return this.activePlans.pipe(
      switchMap(plans => {
        const index = plans.findIndex(it => it.plan.id === id);
        return iif(() => index !== -1, defer(() => of(plans[index].plan)));
      }),
      first()
    );
  }

  updatePlan(plan: WeaponPlan): void {
    zip(this.plans, this.database.update(this.storeName, plan)).subscribe(([plans, _]) => {
      this.marker.clear();
      const newPlans = plans.filter(it => it.id !== plan.id);
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
}
