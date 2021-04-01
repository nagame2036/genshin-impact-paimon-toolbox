import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-number-field',
  templateUrl: './number-field.component.html',
  styleUrls: ['./number-field.component.scss'],
})
export class NumberFieldComponent implements OnInit {
  @Input()
  value!: number;

  wrong = false;

  @Input()
  disabled!: boolean;

  @Output()
  inputted = new EventEmitter<number>();

  @Output()
  changed = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  input(event: Event): void {
    this.emitOnValid(event, this.inputted);
  }

  change(event: Event): void {
    this.emitOnValid(event, this.changed);
  }

  private emitOnValid(event: Event, emitter: EventEmitter<number>): void {
    const text = (event.target as HTMLInputElement).value;
    const value = Number(text);
    if (isNaN(value)) {
      this.wrong = true;
      return;
    }
    this.wrong = false;
    this.value = value;
    emitter.emit(value);
  }
}
