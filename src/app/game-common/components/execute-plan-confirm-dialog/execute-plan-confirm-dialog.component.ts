import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {DialogComponent} from '../../../widget/components/dialog/dialog.component';
import {I18n} from '../../../widget/models/i18n.model';
import {ItemList} from '../../../inventory/models/item-list.model';
import {InventoryService} from '../../../inventory/services/inventory.service';
import {first, map, switchMap} from 'rxjs/operators';
import {Rarity} from '../../models/rarity.type';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {InventoryItemDetail} from '../../../inventory/models/inventory-item-detail.model';
import {NGXLogger} from 'ngx-logger';

type PlanCostItem = { id: number, rarity: Rarity, need: number };

@Component({
  selector: 'app-execute-plan-confirm-dialog',
  templateUrl: './execute-plan-confirm-dialog.component.html',
  styleUrls: ['./execute-plan-confirm-dialog.component.scss']
})
export class ExecutePlanConfirmDialogComponent implements OnInit {

  i18n = new I18n('game-common');

  @Input()
  data = {item: '', title: '', cost: new BehaviorSubject(new ItemList()).asObservable()};

  private confirmSubject = new Subject();

  items$!: Observable<PlanCostItem[]>;

  @ViewChild('dialog')
  dialog!: DialogComponent;

  constructor(private inventory: InventoryService, private logger: NGXLogger) {
  }

  ngOnInit(): void {
    this.logger.info('init');
  }

  open(data: { item: string, title: string, cost: Observable<ItemList> }): ExecutePlanConfirmDialogComponent {
    this.logger.info('open with data', data);
    this.data = data;
    this.items$ = this.inventory.details.pipe(first(), switchMap(it => this.processDetails(it)));
    this.dialog.open();
    this.confirmSubject = new Subject();
    return this;
  }

  confirm(): void {
    this.logger.info('confirmed');
    this.confirmSubject.next();
    this.confirmSubject.complete();
    this.dialog.close();
  }

  afterConfirm(): Observable<any> {
    return this.confirmSubject;
  }

  private processDetails(details: Map<number, InventoryItemDetail>): Observable<PlanCostItem[]> {
    return this.data.cost.pipe(map(cost => {
      return cost.entries().filter(([_, need]) => need > 0)
        .map(([id, need]) => ({id, need, rarity: details.get(id)?.rarity ?? 1}));
    }));
  }

}
