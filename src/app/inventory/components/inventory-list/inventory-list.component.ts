import {Component, ContentChild, Input, OnChanges, SimpleChanges, TemplateRef} from '@angular/core';
import {InventoryItem} from '../../../material/models/inventory-item.model';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {InventoryItemDetail} from '../../../material/models/inventory-item-detail.model';
import {InventoryService} from '../../services/inventory.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.sass']
})
export class InventoryListComponent extends AbstractTranslateComponent implements OnChanges {

  i18nKey = 'inventory';

  @Input()
  subtitle!: string;

  @Input()
  displayOverflow = true;

  @Input()
  items: InventoryItem[] = [];

  details: InventoryItemDetail[] = [];

  subscription!: Subscription;

  @ContentChild('bottom', {static: false})
  bottomTemplateRef!: TemplateRef<any>;

  constructor(private inventory: InventoryService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('items') || changes.hasOwnProperty('displayOverflow')) {
      this.subscription?.unsubscribe();
      this.subscription = this.inventory.getDetails(this.items)
        .subscribe(res => this.details = res.filter(it => !it.overflow || this.displayOverflow));
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
