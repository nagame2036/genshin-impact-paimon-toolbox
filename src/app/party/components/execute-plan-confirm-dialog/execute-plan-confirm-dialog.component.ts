import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {I18n} from '../../../shared/models/i18n.model';
import {ItemList} from '../../../material/models/item-list.model';
import {InventoryService} from '../../../inventory/services/inventory.service';
import {first, map} from 'rxjs/operators';
import {Rarity} from '../../../shared/models/rarity.type';
import {Observable} from 'rxjs';
import {InventoryItemDetail} from '../../../material/models/inventory-item-detail.model';

type PlanCostItem = { id: number, rarity: Rarity, need: number };

@Component({
  selector: 'app-complete-plan-confirm-dialog',
  templateUrl: './execute-plan-confirm-dialog.component.html',
  styleUrls: ['./execute-plan-confirm-dialog.component.scss']
})
export class ExecutePlanConfirmDialogComponent implements OnInit {

  i18n = new I18n('party');

  items$!: Observable<PlanCostItem[]>;

  constructor(private inventory: InventoryService, private dialog: MatDialogRef<ExecutePlanConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { item: string, title: string, cost: ItemList }) {
  }

  static openBy(dialog: MatDialog, data: any, onConfirm: () => void): void {
    dialog.open(ExecutePlanConfirmDialogComponent, {data}).afterClosed().subscribe(confirm => {
      if (confirm) {
        onConfirm();
      }
    });
  }

  ngOnInit(): void {
    this.items$ = this.inventory.details.pipe(first(), map(details => this.processDetails(details)));
  }

  confirm(): void {
    this.dialog.close(true);
  }

  private processDetails(details: Map<number, InventoryItemDetail>): PlanCostItem[] {
    return this.data.cost.entries().filter(it => it[1] > 0)
      .map(([id, need]) => ({id, need, rarity: details.get(id)?.rarity ?? 1}));
  }

}
