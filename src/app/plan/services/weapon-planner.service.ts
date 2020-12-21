import {Injectable} from '@angular/core';
import {Observable, ReplaySubject, zip} from 'rxjs';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {map} from 'rxjs/operators';
import {getLevelupPlan} from '../models/levelup-plan.model';
import {Ascension} from '../../character-and-gear/models/ascension.enum';
import {WeaponPlan} from '../models/weapon-plan.model';

@Injectable({
  providedIn: 'root'
})
export class WeaponPlanner {

  private storeName = 'weapon-plans';

  #plans = new ReplaySubject<WeaponPlan[]>(1);

  plans = this.#plans.asObservable();

  constructor(private database: NgxIndexedDBService) {
    this.database.getAll(this.storeName).subscribe(res => this.#plans.next(res));
  }

  getPlan(id: number): Observable<WeaponPlan> {
    return this.plans.pipe(map(plans => plans[plans.findIndex(it => it.id === id)]));
  }

  updatePlan(id: number, ascension: Ascension, level: number): void {
    const levelup = getLevelupPlan(ascension, level);
    const plan: WeaponPlan = {id, levelup};
    zip(this.plans, this.database.update(this.storeName, plan)).subscribe(([plans, _]) => {
      const newPlans = plans.filter(it => it.id !== id);
      newPlans.push(plan);
      this.#plans.next(newPlans);
    });
  }
}
