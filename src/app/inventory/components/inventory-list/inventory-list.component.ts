import {Component, Input, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {InventoryItemDetail} from '../../models/inventory-item-detail.model';
import {InventoryService} from '../../services/inventory.service';
import {Observable} from 'rxjs';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {

  i18n = new I18n('inventory');

  @Input()
  subtitle!: string;

  @Input()
  showCostDetails = true;

  @Input()
  items$!: Observable<InventoryItemDetail[]>;

  constructor(public inventory: InventoryService, private logger: NGXLogger) {
  }

  ngOnInit(): void {
    this.logger.info('init');
  }

  setHave(detail: InventoryItemDetail, value: number): void {
    const have = Math.max(0, value);
    this.inventory.setItem(detail.id, have);
    this.logger.info('set material have', detail.id, have);
  }

  correct(detail: InventoryItemDetail, value: string): void {
    const text = value.replace(/,/gi, '');
    this.setHave(detail, Number(text) || 0);
  }

  trackItem(index: number, item: InventoryItemDetail): number {
    return item.id;
  }

  notCraftable(item: InventoryItemDetail): boolean {
    return item.craftable < 1 || item.readonly;
  }
}
