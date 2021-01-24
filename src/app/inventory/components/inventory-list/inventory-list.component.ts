import {Component, Input, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {InventoryItemDetail} from '../../../material/models/inventory-item-detail.model';
import {InventoryService} from '../../services/inventory.service';
import {Observable} from 'rxjs';

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

  constructor(public inventory: InventoryService) {
  }

  ngOnInit(): void {
  }

  setHave(detail: InventoryItemDetail, value: number): void {
    const have = Math.max(0, value);
    this.inventory.setItem(detail.id, have);
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
