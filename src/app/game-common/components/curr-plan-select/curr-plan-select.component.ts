import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SelectOption} from '../../../widget/models/select-option.model';

@Component({
  selector: 'app-curr-plan-select',
  templateUrl: './curr-plan-select.component.html',
  styleUrls: ['./curr-plan-select.component.scss'],
})
export class CurrPlanSelectComponent {
  @Input()
  label = '';

  @Input()
  currOptions!: SelectOption[];

  @Input()
  curr!: any;

  @Input()
  planOptions!: SelectOption[];

  @Input()
  plan!: any;

  @Input()
  reached!: boolean;

  @Output()
  currChange = new EventEmitter<number>();

  @Output()
  planChange = new EventEmitter<number>();

  @Output()
  executePlan = new EventEmitter();

  constructor() {}

  setCurr(value: number): void {
    this.curr = value;
    this.currChange.emit(value);
    if (this.plan < value) {
      this.setPlan(value);
    }
  }

  setPlan(value: number): void {
    this.plan = value;
    this.planChange.emit(value);
  }
}
