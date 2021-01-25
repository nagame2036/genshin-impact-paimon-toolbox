import {Injectable} from '@angular/core';
import {InventoryService} from '../../inventory/services/inventory.service';
import {ItemList} from '../../inventory/models/item-list.model';
import {Observable} from 'rxjs';
import {first, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequirementService {

  constructor(private inventory: InventoryService) {
  }

  checkRequirementSatisfied(cost: ItemList): Observable<boolean> {
    return this.inventory.details.pipe(map(details => {
      let nonEmpty = false;
      for (const [id, need] of cost.entries()) {
        nonEmpty = need !== 0;
        const detail = details.get(id);
        if (detail && (detail.have < need)) {
          return false;
        }
      }
      return nonEmpty;
    }));
  }

  consumeMaterial(requirement: Observable<ItemList>): void {
    requirement.pipe(first()).subscribe(req => {
      for (const [id, need] of req.entries()) {
        this.inventory.changeItem(id, -need);
      }
    });
  }
}
