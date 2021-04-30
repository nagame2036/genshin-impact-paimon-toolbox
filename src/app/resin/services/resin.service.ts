import {Injectable} from '@angular/core';
import {DatetimeService} from './datetime.service';
import {I18n} from '../../widget/models/i18n.model';
import {TranslateService} from '@ngx-translate/core';

type Advice = {advice: string[]; resin: number};

@Injectable({
  providedIn: 'root',
})
export class ResinService {
  i18n = I18n.create('resin');

  maxResin = 160;

  maxCondensedResin = 5;

  condensedResinAmount = 40;

  replenishUseMinutes = 8;

  constructor(private datetime: DatetimeService, private translator: TranslateService) {}

  getReplenishDate(target: number, current: number, replenishInMinutes: number): Date {
    const remaining = target - current - 1;
    const minutes = Math.max(0, remaining * this.replenishUseMinutes + replenishInMinutes);
    const time = new Date();
    time.setMinutes(time.getMinutes() + minutes);
    return time;
  }

  formatReplenishDate(target: number, current: number, replenishInMinutes: number): string {
    const date = this.getReplenishDate(target, current, replenishInMinutes);
    return this.datetime.formatRelateDatetime(date);
  }

  getStoreAdvice(targetDate: Date, currentResin: number, replenishInMinutes: number): string[] {
    const now = new Date();
    const minutesDiff = (targetDate.getTime() - now.getTime()) / 60000;
    const limit = this.maxResin;
    const replenishUseMinutes = this.replenishUseMinutes;
    const capacity = limit - currentResin;
    const exceedMinutes = capacity * replenishUseMinutes + replenishInMinutes;
    let results: string[];
    let remainingResin: number;
    if (minutesDiff < exceedMinutes) {
      results = [];
      now.setMinutes(now.getMinutes() + minutesDiff);
      const next = minutesDiff + replenishInMinutes;
      const replenishedResin = Math.floor(next / replenishUseMinutes);
      remainingResin = currentResin + replenishedResin;
      if (minutesDiff >= replenishInMinutes) {
        remainingResin += 1;
      }
    } else {
      const nextReplenish = this.getReplenishDate(limit, currentResin, replenishInMinutes);
      const {advice, resin} = this.getStoreAdviceList(now, minutesDiff, nextReplenish);
      results = advice;
      remainingResin = resin;
    }
    this.pushResult(results, 'target-time-resin', targetDate, remainingResin);
    return results;
  }

  private getStoreAdviceList(now: Date, minutes: number, nextReplenish: Date): Advice {
    const advice: string[] = [];
    const limit = this.maxResin;
    const replenishUseMinutes = this.replenishUseMinutes;
    const condensedAmount = this.condensedResinAmount;
    const condensedUseMinutes = condensedAmount * replenishUseMinutes;
    let condensedCapacity = this.maxCondensedResin;
    const minutesFirstReplenish = (nextReplenish.getTime() - now.getTime()) / 60000;
    now.setMinutes(now.getMinutes() + minutesFirstReplenish);
    const firstCraft = limit / condensedAmount;
    condensedCapacity -= firstCraft;
    minutes -= minutesFirstReplenish;
    this.pushResult(advice, 'craft-condensed-resin', now, firstCraft);
    while (condensedCapacity > 0) {
      const craft = Math.min(condensedCapacity, limit / condensedAmount);
      condensedCapacity -= craft;
      const minutesPassed = craft * condensedUseMinutes;
      if (minutes < minutesPassed) {
        break;
      }
      minutes -= minutesPassed;
      now.setMinutes(now.getMinutes() + minutesPassed);
      this.pushResult(advice, 'craft-condensed-resin', now, craft);
    }
    const replenishLimitUseMinutes = limit * replenishUseMinutes;
    while (minutes > replenishLimitUseMinutes) {
      minutes -= replenishLimitUseMinutes;
      now.setMinutes(now.getMinutes() + replenishLimitUseMinutes);
      this.pushResult(advice, 'spend-resin', now, limit);
    }
    now.setMinutes(now.getMinutes() + minutes);
    const resin = Math.ceil((minutes * limit) / replenishLimitUseMinutes);
    return {advice, resin};
  }

  private pushResult(list: string[], key: string, date: Date, value: number): void {
    const i18n = this.i18n.module(key);
    const time = this.datetime.formatRelateDatetime(date);
    list.push(this.translator.instant(i18n, {time, value}));
  }
}
