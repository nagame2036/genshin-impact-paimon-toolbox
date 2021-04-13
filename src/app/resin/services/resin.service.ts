import {Injectable} from '@angular/core';
import {SettingService} from '../../setting/services/setting.service';
import {ReplaySubject} from 'rxjs';
import {Locale} from '../../app-locale.module';
import {DatetimeService} from './datetime.service';
import {I18n} from '../../widget/models/i18n.model';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ResinService {
  i18n = I18n.create('resin');

  maxResin = 160;

  maxCondensedResin = 5;

  condensedResinAmount = 40;

  replenishUseMinutes = 8;

  localeChanged: ReplaySubject<Locale>;

  constructor(
    private datetime: DatetimeService,
    private translator: TranslateService,
    settings: SettingService,
  ) {
    this.localeChanged = settings.locale;
  }

  getReplenishDate(target: number, current: number, replenishInMinutes: number): string {
    const remaining = target - current - 1;
    let minutes = remaining * this.replenishUseMinutes + replenishInMinutes;
    minutes = Math.max(0, minutes);
    const time = new Date();
    time.setMinutes(time.getMinutes() + minutes);
    return this.datetime.formatDatetime(time);
  }

  getAvoidResinExceedAdvice(
    targetDate: Date,
    currentResin: number,
    replenishInMinutes: number,
  ): string[] {
    const now = new Date();
    const minutesDiff = (targetDate.getTime() - now.getTime()) / 60000;
    const limit = this.maxResin;
    const replenishUseMinutes = this.replenishUseMinutes;
    const capacity = limit - currentResin - 1;
    const exceedMinutes = capacity * replenishUseMinutes + replenishInMinutes;
    let result: string[];
    let remainingResin: number;
    if (minutesDiff < exceedMinutes) {
      result = [];
      now.setMinutes(now.getMinutes() + minutesDiff);
      const next = minutesDiff + replenishInMinutes;
      const replenishedResin = Math.floor(next / replenishUseMinutes);
      remainingResin = currentResin + replenishedResin;
      if (minutesDiff >= replenishInMinutes) {
        remainingResin += 1;
      }
    } else {
      const replenishNext = replenishUseMinutes - replenishInMinutes;
      now.setMinutes(now.getMinutes() - replenishNext);
      const {results, resin} = this.getResinSpendAdvice(now, minutesDiff);
      result = results;
      remainingResin = resin;
    }
    this.pushResult(result, 'target-time-resin', targetDate, remainingResin);
    return result;
  }

  private getResinSpendAdvice(
    now: Date,
    minutes: number,
  ): {results: string[]; resin: number} {
    const results: string[] = [];
    const limit = this.maxResin;
    const replenishUseMinutes = this.replenishUseMinutes;
    const condensedAmount = this.condensedResinAmount;
    const condensedUseMinutes = condensedAmount * replenishUseMinutes;
    let condensedCapacity = this.maxCondensedResin;
    while (condensedCapacity > 0) {
      const craft = Math.min(condensedCapacity, limit / condensedAmount);
      condensedCapacity -= craft;
      const minutesPassed = craft * condensedUseMinutes;
      if (minutes < minutesPassed) {
        break;
      }
      minutes -= minutesPassed;
      now.setMinutes(now.getMinutes() + minutesPassed);
      this.pushResult(results, 'craft-condensed-resin', now, craft);
    }
    const replenishLimitUseMinutes = limit * replenishUseMinutes;
    while (minutes > replenishLimitUseMinutes) {
      minutes -= replenishLimitUseMinutes;
      now.setMinutes(now.getMinutes() + replenishLimitUseMinutes);
      this.pushResult(results, 'spend-resin', now, limit);
    }
    now.setMinutes(now.getMinutes() + minutes);
    const resin = Math.floor((minutes * limit) / replenishLimitUseMinutes);
    return {results, resin};
  }

  private pushResult(list: string[], key: string, date: Date, value: number): void {
    const i18n = this.i18n.module(key);
    const time = this.datetime.formatDatetime(date);
    list.push(this.translator.instant(i18n, {time, value}));
  }
}
