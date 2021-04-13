import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {ResinService} from '../../services/resin.service';
import {rangeList} from '../../../shared/utils/range-list';
import {AbstractObservableDirective} from '../../../shared/directives/abstract-observable.directive';
import {takeUntil} from 'rxjs/operators';
import {combineLatest, timer} from 'rxjs';

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

  constructor(public service: ResinService) {
    super();
  }

  ngOnInit(): void {
    combineLatest([timer(0, 10_000), this.service.localeChanged])
      .pipe(takeUntil(this.destroy$))
      .subscribe(_ => this.updateAll());
  }

  setCurrentResin(value: number): void {
    this.currentResin = value;
    this.updateAll();
  }

  setReplenishInMinutes(value: number): void {
    this.minutes = value;
    this.updateAll();
  }

  setTargetDate(value: Date): void {
    this.targetDate = value;
    this.updateResinCheckResults();
  }

  private updateAll(): void {
    const now = new Date();
    if (this.targetDate < now) {
      this.targetDate = now;
    }
    this.updateReplenishTimes();
    this.updateResinCheckResults();
  }

  private updateReplenishTimes(): void {
    const current = this.currentResin;
    const inMinutes = this.minutes;
    for (const i of this.replenishResults) {
      i.time = this.service.formatRefillDate(i.target, current, inMinutes);
    }
  }

  private updateResinCheckResults(): void {
    this.checkedResults = this.service.getAvoidExceedAdvice(
      this.targetDate,
      this.currentResin,
      this.minutes,
    );
  }
}
