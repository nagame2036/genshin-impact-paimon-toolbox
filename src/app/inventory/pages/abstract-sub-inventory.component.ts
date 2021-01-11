import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {InventoryItem} from '../../material/models/inventory-item.model';
import {MatSelectChange} from '@angular/material/select';
import {ensureAtLeastOneElement} from '../../shared/utils/collections';
import {map, switchMap} from 'rxjs/operators';
import {I18n} from '../../shared/models/i18n.model';
import {InventoryService} from '../services/inventory.service';
import {InventoryItemDetail} from '../../material/models/inventory-item-detail.model';

export abstract class AbstractSubInventoryComponent {

  i18n = new I18n('inventory');

  filter = new BehaviorSubject<(item: InventoryItem) => boolean>(_ => true);

  rarities = [5, 4, 3, 2, 1];

  rarityFilter = this.rarities;

  showOverflow = true;

  protected constructor(private inventory: InventoryService) {
  }

  filterItems(items: Observable<InventoryItem[]>): Observable<InventoryItemDetail[]> {
    return combineLatest([items, this.filter]).pipe(
      map(([list, filter]) => list.filter(item => filter(item))),
      switchMap(it => this.inventory.getDetails(it))
    );
  }

  changeRarityFilter(change: MatSelectChange): void {
    this.rarityFilter = ensureAtLeastOneElement(this.rarityFilter, change.value);
    this.filter.next(item => this.rarityFilter.includes(item.rarity));
  }
}
