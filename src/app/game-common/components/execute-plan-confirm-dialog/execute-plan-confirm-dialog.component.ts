import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {DialogComponent} from '../../../widget/components/dialog/dialog.component';
import {I18n} from '../../../widget/models/i18n.model';
import {ItemList} from '../../../material/models/item-list.model';
import {InventoryService} from '../../../inventory/services/inventory.service';
import {first, map} from 'rxjs/operators';
import {Rarity} from '../../models/rarity.type';
import {Observable, Subject} from 'rxjs';
import {InventoryItemDetail} from '../../../material/models/inventory-item-detail.model';

type PlanCostItem = { id: number, rarity: Rarity, need: number };

@Component({
  selector: 'app-execute-plan-confirm-dialog',
  templateUrl: './execute-plan-confirm-dialog.component.html',
  styleUrls: ['./execute-plan-confirm-dialog.component.scss']
})
export class ExecutePlanConfirmDialogComponent implements OnInit {

  i18n = new I18n('game-common');

  @Input()
  data = {item: '', title: '', cost: new ItemList()};

  confirmSubject = new Subject();

  items$!: Observable<PlanCostItem[]>;

  @ViewChild('dialog')
  dialog!: DialogComponent;

  constructor(private inventory: InventoryService) {
  }

  ngOnInit(): void {
  }

  open(data: { item: string, title: string, cost: ItemList }): ExecutePlanConfirmDialogComponent {
    this.data = data;
    this.items$ = this.inventory.details.pipe(first(), map(details => this.processDetails(details)));
    this.dialog.open();
    this.confirmSubject = new Subject();
    return this;
  }

  confirm(): void {
    this.confirmSubject.next();
    this.confirmSubject.complete();
    this.dialog.close();
  }

  afterConfirm(): Observable<any> {
    return this.confirmSubject;
  }

  private processDetails(details: Map<number, InventoryItemDetail>): PlanCostItem[] {
    return this.data.cost.entries().filter(it => it[1] > 0)
      .map(([id, need]) => ({id, need, rarity: details.get(id)?.rarity ?? 1}));
  }

}
