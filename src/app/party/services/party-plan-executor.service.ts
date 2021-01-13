import {Injectable} from '@angular/core';
import {InventoryService} from '../../inventory/services/inventory.service';
import {ItemList} from '../../material/models/item-list.model';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PartyPlanExecutor {

  item = '';

  plan = '';

  constructor(private inventory: InventoryService) {
  }

  checkDemandSatisfied(cost: ItemList): Observable<boolean> {
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

  consumeDemand(cost: ItemList): void {
    for (const [id, need] of cost.entries()) {
      this.inventory.changeItem(id, -need);
    }
  }
}
