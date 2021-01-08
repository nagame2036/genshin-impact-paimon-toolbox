import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {InventoryItem} from '../../material/models/inventory-item.model';
import {MatSelectChange} from '@angular/material/select';
import {ensureAtLeastOneElement} from '../../shared/utils/collections';
import {map} from 'rxjs/operators';
import {I18n} from '../../shared/models/i18n.model';

export abstract class AbstractSubInventoryComponent {

  i18n = new I18n('inventory');

  filter = new BehaviorSubject<(item: InventoryItem) => boolean>(_ => true);

  rarities = [5, 4, 3, 2, 1];

  rarityFilter = this.rarities;

  showOverflow = true;

  filterItems<T extends InventoryItem>(items: Observable<T[]>): Observable<T[]> {
    return combineLatest([items, this.filter])
      .pipe(map(([list, filter]) => list.filter(item => filter(item))));
  }

  changeRarityFilter(change: MatSelectChange): void {
    this.rarityFilter = ensureAtLeastOneElement(this.rarityFilter, change.value);
    this.filter.next(item => this.rarityFilter.includes(item.rarity));
  }
}
