import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
})
export class InputFieldComponent implements OnInit {
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

  @Input()
  customInput!: TemplateRef<any>;

  constructor() {}

  ngOnInit(): void {}
}
