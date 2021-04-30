import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {ResinService} from '../../services/resin.service';
import {rangeList} from '../../../shared/utils/range-list';
import {combineLatest, timer} from 'rxjs';
import {SettingService} from '../../../setting/services/setting.service';
import {WithOnDestroy} from '../../../shared/abstract/on-destroy';

@Component({
  selector: 'app-resin-calculator',
  templateUrl: './resin-calculator.component.html',
  styleUrls: ['./resin-calculator.component.scss'],
})
export class ResinCalculatorComponent extends WithOnDestroy implements OnInit {
  i18n = I18n.create('resin');

  currentResin = 0;

  minutes = 1;

  replenishResults = rangeList(20, this.service.maxResin, 20)
    .map(it => ({target: it, time: ''}))
    .reverse();

  targetDate = new Date();

  checkedResults: string[] = [];

  constructor(public service: ResinService, private settings: SettingService) {
    super();
  }

  ngOnInit(): void {
    combineLatest([timer(0, 10_000), this.settings.locale])
      .pipe(this.untilDestroy())
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
    for (const r of this.replenishResults) {
      r.time = this.service.formatReplenishDate(r.target, this.currentResin, this.minutes);
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
