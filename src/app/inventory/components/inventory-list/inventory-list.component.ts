import {Component, ContentChild, Input, OnChanges, SimpleChanges, TemplateRef} from '@angular/core';
import {InventoryItem} from '../../../material/models/inventory-item.model';
import {I18n} from '../../../shared/models/i18n.model';
import {InventoryItemDetail} from '../../../material/models/inventory-item-detail.model';
import {InventoryService} from '../../services/inventory.service';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnChanges {

  i18n = new I18n('inventory');

  @Input()
  subtitle!: string;

  @Input()
  showOverflow = true;

  @Input()
  items: InventoryItem[] = [];

  details$: Observable<InventoryItemDetail[]> = new Subject();

  @ContentChild('bottom', {static: false})
  bottomTemplateRef!: TemplateRef<any>;

  constructor(private inventory: InventoryService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('items') || changes.hasOwnProperty('showOverflow')) {
      this.details$ = this.inventory.getDetails(this.items)
        .pipe(map(details => details.filter(it => !it.overflow || this.showOverflow)));
    }
  }

  setHave(detail: InventoryItemDetail, value: number): void {
    const have = Math.max(0, value);
    this.inventory.setItem(detail.id, have);
  }

  inc(detail: InventoryItemDetail): void {
    this.setHave(detail, detail.have + 1);
  }

  dec(detail: InventoryItemDetail): void {
    this.setHave(detail, detail.have - 1);
  }

  correct(detail: InventoryItemDetail, event: Event): void {
    const target = event.target as HTMLInputElement;
    const text = target.value.replace(/,/gi, '');
    this.setHave(detail, Number(text) || 0);
  }

  trackItem(index: number, item: InventoryItemDetail): number {
    return item.id;
  }

  craft(detail: InventoryItemDetail, craftNeed: number): void {
    this.inventory.craft(detail, craftNeed);
  }
}
