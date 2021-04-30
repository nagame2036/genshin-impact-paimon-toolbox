import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
})
export class InputFieldComponent {
  @Input()
  label = '';

  @Input()
  value = '';

  hover = false;

  focus = false;

  @Input()
  wrong = false;

  @Input()
  disabled!: boolean;

  @Output()
  inputted = new EventEmitter<string>();

  @Output()
  changed = new EventEmitter<string>();

  constructor() {}
}
