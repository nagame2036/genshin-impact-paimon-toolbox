import {Injectable} from '@angular/core';
import {CharacterPlanner} from './character-planner.service';
import {RequirementService} from '../../game-common/services/requirement.service';
import {combineLatest, Observable} from 'rxjs';
import {ItemList} from '../../inventory/models/item-list.model';
import {map, mergeMap, tap} from 'rxjs/operators';
import {InventoryService} from '../../inventory/services/inventory.service';
import {NGXLogger} from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class CharacterRequirementService {

  constructor(private planner: CharacterPlanner, private requirement: RequirementService, private inventory: InventoryService,
              private logger: NGXLogger) {
  }

  getRequirements(id: number): Observable<{ text: string, value: Observable<ItemList>, satisfied: Observable<boolean> }[]> {
    return combineLatest([this.inventory.details, this.planner.specificPlanCost(id)]).pipe(
      map(([_, costs]) => {
          return costs.map(it => {
            const satisfied = it.value.pipe(mergeMap(value => {
              return this.requirement.checkRequirementSatisfied(value);
            }));
            return ({...it, satisfied});
          });
        }
      ),
      tap(requirements => this.logger.info('sent requirements', requirements)),
    );
  }

  consumeMaterial(requirement: Observable<ItemList>): void {
    this.requirement.consumeMaterial(requirement);
  }
}
