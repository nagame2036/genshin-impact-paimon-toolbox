import {Injectable} from '@angular/core';
import {InventoryService} from '../../inventory/services/inventory.service';
import {ItemList} from '../../inventory/models/item-list.model';
import {Observable} from 'rxjs';
import {first, map, tap} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class RequirementService {

  constructor(private inventory: InventoryService, private logger: NGXLogger) {
  }

  checkRequirementSatisfied(requirement: ItemList): Observable<boolean> {
    return this.inventory.details.pipe(
      map(details => {
        let nonEmpty = false;
        for (const [id, need] of requirement.entries()) {
          nonEmpty = need !== 0;
          const detail = details.get(id);
          if (detail && (detail.have < need)) {
            return false;
          }
        }
        return nonEmpty;
      }),
      tap(satisfied => this.logger.debug('sent requirement satisfied', satisfied, requirement))
    );
  }

  consumeMaterial(requirement: Observable<ItemList>): void {
    requirement.pipe(first()).subscribe(req => {
      for (const [id, need] of req.entries()) {
        this.inventory.changeItem(id, -need);
      }
      this.logger.info('consumed materials', requirement);
    });
  }
}
