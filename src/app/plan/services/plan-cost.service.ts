import {Injectable} from '@angular/core';
import {CharacterPlanner} from './character-planner.service';
import {WeaponPlanner} from './weapon-planner.service';
import {combineLatest, ReplaySubject} from 'rxjs';
import {ItemCostList} from '../models/item-cost-list.model';

@Injectable({
  providedIn: 'root'
})
export class PlanCostService {

  #cost = new ReplaySubject<ItemCostList>(1);

  readonly cost = this.#cost.asObservable();

  constructor(private characters: CharacterPlanner, private weapons: WeaponPlanner) {
    combineLatest([characters.plansCost(), weapons.plansCost()]).subscribe(([characterCost, weaponCost]) => {
      const cost = new ItemCostList().combine(characterCost).combine(weaponCost);
      this.#cost.next(cost);
    });
  }
}
