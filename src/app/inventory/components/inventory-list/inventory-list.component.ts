import {Component, ContentChild, Input, OnChanges, SimpleChanges, TemplateRef} from '@angular/core';
import {I18n} from '../../../shared/models/i18n.model';
import {InventoryItemDetail} from '../../../material/models/inventory-item-detail.model';
import {InventoryService} from '../../services/inventory.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {MaterialCostDetailDialogComponent} from '../material-cost-detail-dialog/material-cost-detail-dialog.component';

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
  showCostDetails = true;

  @Input()
  showOverflow = true;

  @Input()
  items!: Observable<InventoryItemDetail[]>;

  @ContentChild('bottom', {static: false})
  bottomTemplateRef!: TemplateRef<any>;

  constructor(private inventory: InventoryService, private dialog: MatDialog) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('items') || changes.hasOwnProperty('showOverflow')) {
      this.items = this.items.pipe(map(details => details.filter(it => !it.overflow || this.showOverflow)));
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

  craft(detail: InventoryItemDetail, performedTimes: number): void {
    this.inventory.craftItem(detail, performedTimes);
  }

  openCostDetailDialog(id: number): void {
    this.dialog.open(MaterialCostDetailDialogComponent, {data: id});
  }
}
