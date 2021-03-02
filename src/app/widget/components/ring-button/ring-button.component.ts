import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-ring-button',
  templateUrl: './ring-button.component.html',
  styleUrls: ['./ring-button.component.scss'],
})
export class RingButtonComponent implements OnInit {
  @Input()
  disabled = false;

  @Output()
  clicked = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  emitClick(): void {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
