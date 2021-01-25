import {Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {SelectOption} from '../../models/select-option.model';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnChanges {

  @Input()
  value!: any;

  valueText!: string;

  @Input()
  options!: SelectOption[];

  @Output()
  changed = new EventEmitter<any>();

  hover = false;

  focus = false;

  opened = false;

  constructor(private self: ElementRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('value')) {
      this.changeValueText(changes.value.currentValue);
    }
  }

  change(option: SelectOption): void {
    const value = option.value;
    this.value = value;
    this.changeValueText(this.value);
    this.changed.emit(value);
    this.opened = false;
  }

  changeValueText(value: any): void {
    this.valueText = this.options.find(it => it.value === value)?.text ?? '';
  }

  @HostListener('window:click', ['$event'])
  clickOutside(event: Event): void {
    if (!this.self.nativeElement.contains(event.target)) {
      this.opened = false;
    }
  }
}