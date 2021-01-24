import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss']
})
export class TextFieldComponent implements OnInit {

  @Input()
  value!: string;

  @Input()
  disabled!: boolean;

  @Output()
  inputted = new EventEmitter<string>();

  @Output()
  changed = new EventEmitter<string>();

  hover = false;

  focus = false;

  constructor() {
  }

  ngOnInit(): void {
  }

}
