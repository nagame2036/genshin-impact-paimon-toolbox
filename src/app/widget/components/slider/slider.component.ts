import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {rangeList} from '../../../shared/utils/range-list';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnChanges {
  @Input()
  value = 0;

  @Input()
  min = 0;

  @Input()
  max = Infinity;

  @Input()
  step = 1;

  @Output()
  changed = new EventEmitter<number>();

  range!: number[];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (['min', 'max', 'step'].some(it => changes.hasOwnProperty(it))) {
      const min = this.min;
      const max = this.max;
      const step = this.step;
      const toShort = (max - min) / step > 10;
      this.range = toShort ? rangeList(0, 4) : rangeList(min, max, step);
    }
  }

  change(num: number): void {
    const after = this.value + num;
    if (this.min <= after && after <= this.max) {
      this.emit(after);
    }
  }

  emitChange(value: string): void {
    this.emit(Number(value));
  }

  private emit(value: number): void {
    this.value = value;
    this.changed.emit(value);
  }
}
