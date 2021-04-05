import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import {I18n} from '../../models/i18n.model';
import {DatetimeService} from '../../services/datetime.service';
import {AbstractObservableDirective} from '../../../shared/directives/abstract-observable.directive';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-datetime-picker',
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.scss'],
})
export class DatetimePickerComponent
  extends AbstractObservableDirective
  implements OnInit {
  i18n = I18n.create('widget');

  yearMonth = new Date();

  daysPrevMonth: number[] = [];

  daysCurrMonth: number[] = [];

  value = new Date();

  hour = this.value.getHours();

  minute = this.value.getMinutes();

  @Output()
  changed = new EventEmitter<Date>();

  opened = false;

  constructor(public service: DatetimeService, private self: ElementRef) {
    super();
    service.weekdays
      .pipe(takeUntil(this.destroy$))
      .subscribe(_ => this.updateCalendar());
  }

  ngOnInit(): void {}

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

  setDate(value: number): void {
    this.value = new Date(this.yearMonth);
    this.value.setDate(value);
    this.value.setHours(this.hour);
    this.value.setMinutes(this.minute);
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

  @HostListener('window:click', ['$event'])
  clickOutside(event: Event): void {
    if (!this.self.nativeElement.contains(event.target)) {
      this.opened = false;
    }
  }

  private updateCalendar(): void {
    const [prev, curr] = this.service.getCalendar(this.yearMonth);
    this.daysPrevMonth = prev;
    this.daysCurrMonth = curr;
  }
}
