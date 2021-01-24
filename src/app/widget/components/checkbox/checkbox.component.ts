import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {

  @Input()
  label!: string;

  @Input()
  value!: boolean;

  @Output()
  checked = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit(): void {
  }

  emitChange(): void {
    this.value = !this.value;
    this.checked.emit(this.value);
  }

}
