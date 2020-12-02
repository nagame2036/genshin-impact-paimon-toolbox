import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {coerceIn} from '../../shared/utils/coerce';
import {TranslateService} from '@ngx-translate/core';
import {AbstractTranslateComponent} from '../../shared/abstract-translate.component';

@Component({
  selector: 'app-resin-replenish-calculator',
  templateUrl: './resin-replenish-calculator.component.html',
  styleUrls: ['./resin-replenish-calculator.component.sass']
})
export class ResinReplenishCalculatorComponent extends AbstractTranslateComponent implements OnInit {

  private static renderOptions = {
    hour12: false,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric'
  };

  i18nKey = 'resin.replenish';

  resin = new FormControl(0, [Validators.min(0), Validators.max(160)]);

  minutes = new FormControl(8);

  results = [20, 40, 60, 80, 120].map(i => {
    return {target: i, control: new FormControl('')};
  });

  resinFull = new FormControl('');

  constructor(private translator: TranslateService) {
    super();
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
    this.results.forEach(i => i.control.setValue(this.replenishedTime(i.target)));
    this.resinFull.setValue(this.replenishedTime(160));
  }

  private replenishedTime(targetResin: number): string {
    const currentResin = this.resin.value;
    const replenishToMinutes = this.minutes.value;
    const remainingMinutes = (targetResin - currentResin - 1) * 8 + replenishToMinutes;
    const minutes = Math.max(0, remainingMinutes);
    const time = new Date();
    time.setMinutes(time.getMinutes() + minutes);
    return time.toLocaleString(this.translator.currentLang, ResinReplenishCalculatorComponent.renderOptions);
  }

}
