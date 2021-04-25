import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-ring-button',
  templateUrl: './ring-button.component.html',
  styleUrls: ['./ring-button.component.scss'],
})
export class RingButtonComponent {
  @Input()
  color: 'normal' | 'primary' | 'red' = 'normal';

  @Input()
  disabled = false;

  @Input()
  disableTab = false;

  @Output()
  clicked = new EventEmitter();

  constructor() {}

  emitClick(): void {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
