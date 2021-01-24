import {Component, EventEmitter, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-ring-button',
  templateUrl: './ring-button.component.html',
  styleUrls: ['./ring-button.component.scss']
})
export class RingButtonComponent implements OnInit {

  @Input()
  disabled = false;

  clicked = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

}
