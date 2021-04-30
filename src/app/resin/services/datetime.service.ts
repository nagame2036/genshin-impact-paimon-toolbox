import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {SettingService} from '../../setting/services/setting.service';
import {Locale} from '../../app-locale.module';
import {rangeList} from '../../shared/utils/range-list';
import {WithLocale} from '../../setting/abstract/with-locale';

const relateDateFormat = {month: 'short', day: 'numeric'};

const relateTimeFormat = {hour: 'numeric', minute: 'numeric', hourCycle: 'h23'};

const weekdayDates = rangeList(4, 10)
  .reverse()
  .map(date => new Date(2021, 3, date));

@Injectable({
  providedIn: 'root',
})
export class DatetimeService extends WithLocale {
  currentLocale = this.settings.defaultLocale;

  weekdays = new ReplaySubject<string[]>(1);

  /**
   * For locale zh.
   */
  defaultWeekStart = 1;

  specialWeekStart: Partial<Record<Locale, number>> = {
    en: 0,
  };

  relativeFormat!: Intl.RelativeTimeFormat;

  relateDateFormat!: Intl.DateTimeFormat;

  relateTimeFormat!: Intl.DateTimeFormat;

  weekdayFormat!: Intl.DateTimeFormat;

  yearMonthFormat!: Intl.DateTimeFormat;

  constructor(settings: SettingService) {
    super(settings);
    this.listenLocaleChange();
  }

  is(source: Date, yearMonth: Date, day: number): boolean {
    return (
      source.getFullYear() === yearMonth.getFullYear() &&
      source.getMonth() === yearMonth.getMonth() &&
      source.getDate() === day
    );
  }

  formatRelateDatetime(target: Date): string {
    const dates = [new Date(), new Date(target)];
    dates.forEach(it => {
      it.setHours(0);
      it.setMinutes(0);
    });
    const dayDiff = Math.round((dates[1].getTime() - dates[0].getTime()) / 86_400_000);
    const relative = this.relativeFormat.format(dayDiff, 'day');
    const date = this.relateDateFormat.format(target);
    const time = this.relateTimeFormat.format(target);
    return `${time}, ${relative} (${date})`;
  }

  getCalendar(date: Date): [number[], number[]] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const weekStart = this.specialWeekStart[this.currentLocale] ?? this.defaultWeekStart;
    const weekday1st = new Date(year, month).getDay();
    const weekday1stOffset = (7 + weekday1st - weekStart) % 7;
    const daysPrevMonth = rangeList(1, weekday1stOffset);
    const daysCurrMonthCount = new Date(year, month + 1, 0).getDate();
    const daysCurrMonth = rangeList(1, daysCurrMonthCount).reverse();
    return [daysPrevMonth, daysCurrMonth];
  }

  protected onLocaleChange(locale: Locale): void {
    this.currentLocale = locale;
    this.updateFormatters(locale);
    this.emitWeekdays(locale);
  }

  private updateFormatters(locale: Locale): void {
    this.relativeFormat = new Intl.RelativeTimeFormat(locale, {numeric: 'auto'});
    this.relateDateFormat = new Intl.DateTimeFormat(locale, relateDateFormat);
    this.relateTimeFormat = new Intl.DateTimeFormat(locale, relateTimeFormat);
    this.weekdayFormat = new Intl.DateTimeFormat(locale, {weekday: 'short'});
    this.yearMonthFormat = new Intl.DateTimeFormat(locale, {year: 'numeric', month: 'short'});
  }

  private emitWeekdays(locale: Locale): void {
    const special = this.specialWeekStart[locale];
    const start = special !== undefined ? special : this.defaultWeekStart;
    const dates = [...weekdayDates.slice(start, 7), ...weekdayDates.slice(0, start)];
    const result = dates.map(it => this.weekdayFormat.format(it));
    this.weekdays.next(result);
  }
}
