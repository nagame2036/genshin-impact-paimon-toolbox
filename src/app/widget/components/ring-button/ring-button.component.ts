import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-ring-button',
  templateUrl: './ring-button.component.html',
  styleUrls: ['./ring-button.component.scss'],
})
export class RingButtonComponent implements OnInit {
  @Input()
  color: 'normal' | 'primary' | 'red' = 'normal';

  colorClass = 'ring-btn-normal';

  @Input()
  disabled = false;

  @Input()
  disableTab = false;

  @Output()
  clicked = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    switch (this.color) {
      case 'primary':
        this.colorClass = 'ring-btn-primary';
        break;
      case 'red':
        this.colorClass = 'ring-btn-red';
        break;
      default:
        this.colorClass = 'ring-btn-normal';
        break;
    }
  }

  emitClick(): void {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
