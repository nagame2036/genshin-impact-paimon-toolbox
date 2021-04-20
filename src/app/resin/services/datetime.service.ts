import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {SettingService} from '../../setting/services/setting.service';
import {defaultLocale, Locale} from '../../app-locale.module';
import {rangeList} from '../../shared/utils/range-list';

const datetimeFormat = {
  year: 'numeric',
  month: 'short',
  weekday: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hourCycle: 'h23',
};

const weekdayDates = [
  new Date('2021-03-28'),
  new Date('2021-03-29'),
  new Date('2021-03-30'),
  new Date('2021-03-31'),
  new Date('2021-04-01'),
  new Date('2021-04-02'),
  new Date('2021-04-03'),
];

@Injectable({
  providedIn: 'root',
})
export class DatetimeService {
  currentLocale: Locale = defaultLocale;

  weekdays = new ReplaySubject<string[]>(1);

  /**
   * For locale zh.
   */
  defaultWeekStart = 1;

  specialWeekStart: Partial<Record<Locale, number>> = {
    en: 0,
  };

  constructor(private settings: SettingService) {
    settings.locale.subscribe(locale => {
      this.currentLocale = locale;
      this.emitWeekdays(locale);
    });
  }

  is(source: Date, yearMonth: Date, day: number): boolean {
    return (
      source.getFullYear() === yearMonth.getFullYear() &&
      source.getMonth() === yearMonth.getMonth() &&
      source.getDate() === day
    );
  }

  formatDatetime(date: Date): string {
    return date.toLocaleString(this.currentLocale, datetimeFormat);
  }

  formatYearMonth(date: Date): string {
    const options = {year: 'numeric', month: 'short'};
    return date.toLocaleString(this.currentLocale, options);
  }

  getCalendar(date: Date, locale: Locale = this.currentLocale): [number[], number[]] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const weekStart = this.specialWeekStart[locale] ?? this.defaultWeekStart;
    const weekday1st = new Date(year, month).getDay();
    const weekday1stOffset = (7 + weekday1st - weekStart) % 7;
    const daysPrevMonth = rangeList(1, weekday1stOffset);
    const daysCurrMonthCount = new Date(year, month + 1, 0).getDate();
    const daysCurrMonth = rangeList(1, daysCurrMonthCount).reverse();
    return [daysPrevMonth, daysCurrMonth];
  }

  private emitWeekdays(locale: Locale): void {
    const formatter = new Intl.DateTimeFormat(locale, {weekday: 'short'});
    const weekStart = this.specialWeekStart[locale] ?? this.defaultWeekStart;
    const dates = [...weekdayDates.slice(weekStart, 7), ...weekdayDates.slice(0, weekStart)];
    const result = dates.map(it => formatter.format(it));
    this.weekdays.next(result);
  }
}
