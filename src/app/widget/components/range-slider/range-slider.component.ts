import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss']
})
export class RangeSliderComponent implements OnInit {

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

  constructor() {
  }

  ngOnInit(): void {
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
