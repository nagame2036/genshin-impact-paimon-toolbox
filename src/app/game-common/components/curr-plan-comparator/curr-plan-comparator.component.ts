import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-curr-plan-comparator',
  templateUrl: './curr-plan-comparator.component.html',
  styleUrls: ['./curr-plan-comparator.component.scss'],
})
export class CurrPlanComparatorComponent {
  @Input()
  label = '';

  @Input()
  curr!: string | null;

  @Input()
  plan!: string | null;

  constructor() {}
}
