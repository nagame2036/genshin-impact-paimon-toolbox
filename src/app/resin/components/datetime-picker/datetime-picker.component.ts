import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {DatetimeService} from '../../services/datetime.service';
import {WithOnDestroy} from '../../../shared/abstract/on-destroy';

@Component({
  selector: 'app-datetime-picker',
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.scss'],
})
export class DatetimePickerComponent extends WithOnDestroy implements OnChanges {
  i18n = I18n.create('widget');

  @Input()
  label = '';

  yearMonth = new Date();

  daysPrevMonth: number[] = [];

  daysCurrMonth: number[] = [];

  @Input()
  value = new Date();

  hour = 0;

  minute = 0;

  @Output()
  changed = new EventEmitter<Date>();

  opened = false;

  constructor(public service: DatetimeService) {
    super();
    service.weekdays.pipe(this.untilDestroy()).subscribe(_ => this.updateCalendar());
  }

  ngOnChanges(changes: SimpleChanges): void {
    const value = changes.value;
    if (value && value.currentValue > value.previousValue) {
      this.hour = this.value.getHours();
      this.minute = this.value.getMinutes();
    }
  }

  isToday(day: number): boolean {
    return this.service.is(new Date(), this.yearMonth, day);
  }

  isSelected(day: number): boolean {
    return this.service.is(this.value, this.yearMonth, day);
  }

  moveMonth(value: number): void {
    this.yearMonth.setMonth(this.yearMonth.getMonth() + value);
    this.updateCalendar();
  }

  setDate(date: number): void {
    const day = this.yearMonth;
    this.value = new Date(day.getFullYear(), day.getMonth(), date, this.hour, this.minute);
    this.changed.emit(this.value);
  }

  setValueNow(): void {
    this.value = new Date();
    this.hour = this.value.getHours();
    this.minute = this.value.getMinutes();
    this.changed.emit(this.value);
  }

  setHour(value: number): void {
    this.value.setHours(value);
    this.hour = value;
    this.changed.emit(this.value);
  }

  setMinute(value: number): void {
    this.value.setMinutes(value);
    this.minute = value;
    this.changed.emit(this.value);
  }

  private updateCalendar(): void {
    const [prev, curr] = this.service.getCalendar(this.yearMonth);
    this.daysPrevMonth = prev;
    this.daysCurrMonth = curr;
  }
}
