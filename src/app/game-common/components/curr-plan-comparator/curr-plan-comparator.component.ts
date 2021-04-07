import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-curr-plan-comparator',
  templateUrl: './curr-plan-comparator.component.html',
  styleUrls: ['./curr-plan-comparator.component.scss'],
})
export class CurrPlanComparatorComponent implements OnInit {
  @Input()
  label = '';

  @Input()
  curr!: string | null;

  @Input()
  plan!: string | null;

  constructor() {}

  ngOnInit(): void {}
}
