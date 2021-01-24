import {Component, OnInit} from '@angular/core';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {I18n} from '../../../widget/models/i18n.model';

const timeFormat = {
  hour12: false,
  month: 'short',
  day: 'numeric',
  weekday: 'short',
  hour: 'numeric',
  minute: 'numeric'
};

@Component({
  selector: 'app-resin-replenish-calculator',
  templateUrl: './resin-replenish-calculator.component.html',
  styleUrls: ['./resin-replenish-calculator.component.scss']
})
export class ResinReplenishCalculatorComponent implements OnInit {

  i18n = new I18n('resin.replenish');

  currentLanguage = '';

  resin = 0;

  minutes = 0;

  results = [
    {target: 20, time: ''},
    {target: 40, time: ''},
    {target: 60, time: ''},
    {target: 80, time: ''},
    {target: 100, time: ''},
    {target: 120, time: ''},
    {target: 140, time: ''},
    {target: 160, time: ''}
  ];

  constructor(private translator: TranslateService) {
  }

  ngOnInit(): void {
    this.changeLanguage(this.translator.currentLang);
    this.translator.onLangChange.subscribe((event: LangChangeEvent) => {
      this.changeLanguage(event.lang);
    });
  }

  setResin(value: number): void {
    this.resin = value;
    this.renderResult();
  }

  setMinutes(value: number): void {
    this.minutes = value;
    this.renderResult();
  }

  private changeLanguage(language: string): void {
    this.currentLanguage = language;
    this.renderResult();
  }

  private renderResult(): void {
    this.results.forEach(i => i.time = this.replenishedTime(i.target));
  }

  private replenishedTime(targetResin: number): string {
    const remainingMinutes = (targetResin - this.resin - 1) * 8 + this.minutes;
    const minutes = Math.max(0, remainingMinutes);
    const time = new Date();
    time.setMinutes(time.getMinutes() + minutes);
    return time.toLocaleString(this.currentLanguage, timeFormat).replace('24:', '00:');
  }
}
