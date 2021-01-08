import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {coerceIn} from '../../../shared/utils/coerce';
import {TranslateService} from '@ngx-translate/core';
import {I18n} from '../../../shared/models/i18n.model';

@Component({
  selector: 'app-resin-replenish-calculator',
  templateUrl: './resin-replenish-calculator.component.html',
  styleUrls: ['./resin-replenish-calculator.component.scss']
})
export class ResinReplenishCalculatorComponent implements OnInit {

  private static renderOptions = {
    hour12: false,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric'
  };

  i18n = new I18n('resin.replenish');

  resin = new FormControl(0, [Validators.min(0), Validators.max(160)]);

  minutes = new FormControl(8);

  results = [
    {target: 20, value: ''},
    {target: 40, value: ''},
    {target: 60, value: ''},
    {target: 80, value: ''},
    {target: 120, value: ''},
    {target: 160, value: ''}
  ];

  constructor(private translator: TranslateService) {
  }

  ngOnInit(): void {
    this.renderResult();
  }

  correctResin(): void {
    const resin = this.resin.value;
    this.resin.setValue(coerceIn(resin, 0, 160));
    this.correctMinutes();
  }

  correctMinutes(): void {
    if (this.resin.value >= 160) {
      this.minutes.setValue(0);
    }
    this.renderResult();
  }

  renderResult(): void {
    this.results.forEach(i => i.value = this.replenishedTime(i.target));
  }

  private replenishedTime(targetResin: number): string {
    const remainingMinutes = (targetResin - this.resin.value - 1) * 8 + this.minutes.value;
    const minutes = Math.max(0, remainingMinutes);
    const time = new Date();
    time.setMinutes(time.getMinutes() + minutes);
    return time.toLocaleString(this.translator.currentLang, ResinReplenishCalculatorComponent.renderOptions);
  }

}
