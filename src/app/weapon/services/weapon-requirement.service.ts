import {Injectable} from '@angular/core';
import {WeaponPlanner} from './weapon-planner.service';
import {RequirementService} from '../../game-common/services/requirement.service';
import {combineLatest, Observable} from 'rxjs';
import {ItemList} from '../../inventory/models/item-list.model';
import {map, mergeMap} from 'rxjs/operators';
import {InventoryService} from '../../inventory/services/inventory.service';

@Injectable({
  providedIn: 'root'
})
export class WeaponRequirementService {

  constructor(private planner: WeaponPlanner, private requirement: RequirementService, private inventory: InventoryService) {
  }

  getRequirements(id: number): Observable<{ text: string, value: Observable<ItemList>, satisfied: Observable<boolean> }[]> {
    return combineLatest([this.inventory.details, this.planner.specificPlanCost(id)]).pipe(map(([_, costs]) => {
      return costs.map(it => ({
        ...it,
        satisfied: it.value.pipe(mergeMap(value => {
          return this.requirement.checkRequirementSatisfied(value);
        }))
      }));
    }));
  }

  consumeMaterial(requirement: Observable<ItemList>): void {
    this.requirement.consumeMaterial(requirement);
  }
}
