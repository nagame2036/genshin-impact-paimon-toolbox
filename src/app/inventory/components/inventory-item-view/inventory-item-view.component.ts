import {Component, Input, OnInit} from '@angular/core';
import {coerceIn} from '../../../shared/utils/coerce';
import {InventoryService} from '../../services/inventory.service';
import {PlanCostService} from '../../../plan/services/plan-cost.service';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';

@Component({
  selector: 'app-inventory-item-view',
  templateUrl: './inventory-item-view.component.html',
  styleUrls: ['./inventory-item-view.component.sass']
})
export class InventoryItemViewComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'inventory';

  @Input()
  width = 86;

  @Input()
  id!: number;

  need = 0;

  have = 0;

  readonly = false;

  @Input()
  incStep = 1;

  private numReg = /[0-9]*/;

  constructor(private inventory: InventoryService, private cost: PlanCostService) {
    super();
  }

  get lack(): number {
    return Math.max(0, this.need - this.have);
  }

  ngOnInit(): void {
    this.inventory.getAmount(this.id).subscribe(res => {
      this.have = res.amount;
      this.readonly = res.readonly ?? false;
    });
    this.cost.cost.subscribe(res => this.need = res.get(this.id));
  }

  setValue(value: number): void {
    this.have = coerceIn(value, 0, 9_999_999_999);
    this.inventory.setAmount(this.id, this.have);
  }

  inc(): void {
    this.setValue(this.have + this.incStep);
  }

  dec(): void {
    this.setValue(this.have - this.incStep);
  }

  correct(event: Event): void {
    const target = event.target as HTMLInputElement;
    const text = target.value.replace(/,/gi, '');
    if (!this.numReg.test(text)) {
      event.preventDefault();
      return;
    }
    this.setValue(Number(text));
  }
}
