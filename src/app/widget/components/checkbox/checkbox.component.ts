import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent {
  @Input()
  label!: string;

  @Input()
  value!: boolean;

  @Output()
  checked = new EventEmitter<boolean>();

  constructor() {}

  emitChange(): void {
    this.value = !this.value;
    this.checked.emit(this.value);
  }
}
