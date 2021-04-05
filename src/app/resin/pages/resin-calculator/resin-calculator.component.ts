import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {NGXLogger} from 'ngx-logger';
import {ResinService} from '../../services/resin.service';
import {rangeList} from '../../../shared/utils/range-list';
import {AbstractObservableDirective} from '../../../shared/directives/abstract-observable.directive';

@Component({
  selector: 'app-resin-calculator',
  templateUrl: './resin-calculator.component.html',
  styleUrls: ['./resin-calculator.component.scss'],
})
export class ResinCalculatorComponent
  extends AbstractObservableDirective
  implements OnInit {
  i18n = I18n.create('resin');

  currentResin = 0;

  minutes = 1;

  replenishResults = rangeList(20, this.service.maxResin, 20)
    .map(it => ({target: it, time: ''}))
    .reverse();

  targetDate = new Date();

  checkedResults: string[] = [];

  constructor(public service: ResinService, private logger: NGXLogger) {
    super();
  }

  ngOnInit(): void {
    this.service.localeChanged.subscribe(_ => {
      this.updateReplenishTimes();
      this.updateResinCheckResults();
    });
  }

  setCurrentResin(value: number): void {
    this.currentResin = value;
    this.logger.info('set current resin', value);
    this.updateReplenishTimes();
    this.updateResinCheckResults();
  }

  setReplenishInMinutes(value: number): void {
    this.minutes = value;
    this.logger.info('set replenish in minutes', value);
    this.updateReplenishTimes();
    this.updateResinCheckResults();
  }

  setTargetDate(value: Date): void {
    this.targetDate = value;
    this.logger.info('set target date', value);
    this.updateResinCheckResults();
  }

  private updateReplenishTimes(): void {
    const current = this.currentResin;
    const inMinutes = this.minutes;
    for (const i of this.replenishResults) {
      i.time = this.service.getReplenishDate(i.target, current, inMinutes);
    }
  }

  private updateResinCheckResults(): void {
    this.checkedResults = this.service.getAvoidResinExceedAdvice(
      this.targetDate,
      this.currentResin,
      this.minutes,
    );
  }
}
