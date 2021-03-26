import {Component, Input, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';

@Component({
  selector: 'app-curr-plan-stats-comparator',
  templateUrl: './curr-plan-stats-comparator.component.html',
  styleUrls: ['./curr-plan-stats-comparator.component.scss'],
})
export class CurrPlanStatsComparatorComponent implements OnInit {
  i18n = new I18n('game-common');
  @Input()
  type = '';

  @Input()
  curr!: number;

  @Input()
  plan!: number;

  constructor() {}

  ngOnInit(): void {}
}
