import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {NGXLogger} from 'ngx-logger';
import {ResinService} from '../../services/resin.service';
import {rangeList} from '../../../shared/utils/range-list';
import {AbstractObservableDirective} from '../../../shared/directives/abstract-observable.directive';

@Component({
  selector: 'app-resin-replenish-time',
  templateUrl: './resin-replenish-time.component.html',
  styleUrls: ['./resin-replenish-time.component.scss'],
})
export class ResinReplenishTimeComponent
  extends AbstractObservableDirective
  implements OnInit {
  i18n = I18n.create('resin');

  currentResin = 0;

  minutes = 0;

  results = rangeList(0, this.service.maxResin, 20)
    .map(it => ({target: it, time: ''}))
    .reverse();

  constructor(public service: ResinService, private logger: NGXLogger) {
    super();
  }

  ngOnInit(): void {
    this.service.languageChanged.subscribe(_ => this.updateReplenishTimes());
  }

  setCurrentResin(value: number): void {
    this.currentResin = value;
    this.logger.info('set current resin', value);
    this.updateReplenishTimes();
  }

  setReplenishInMinutes(value: number): void {
    this.minutes = value;
    this.logger.info('set replenish in minutes', value);
    this.updateReplenishTimes();
  }

  private updateReplenishTimes(): void {
    const current = this.currentResin;
    const inMinutes = this.minutes;
    for (const i of this.results) {
      i.time = this.service.getReplenishDate(i.target, current, inMinutes);
    }
  }
}
