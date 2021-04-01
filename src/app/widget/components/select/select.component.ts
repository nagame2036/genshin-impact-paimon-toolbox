import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import {SelectOption} from '../../models/select-option.model';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnChanges {
  @Input()
  value!: any;

  @Input()
  valueText!: string;

  @Input()
  options!: SelectOption[];

  @Output()
  changed = new EventEmitter<any>();

  @Input()
  customDropdown!: TemplateRef<any>;

  @Input()
  customOptions!: TemplateRef<any>;

  hover = false;

  focus = false;

  @Input()
  opened = false;

  constructor(private self: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (['value', 'options'].some(it => changes.hasOwnProperty(it))) {
      this.changeValueText(this.value);
    }
  }

  change(option: SelectOption): void {
    const value = option.value;
    this.value = value;
    this.changeValueText(this.value);
    setTimeout(() => (this.opened = false), 10);
    this.changed.emit(value);
  }

  changeValueText(value: any): void {
    this.valueText = this.options?.find(it => it.value === value)?.text ?? '';
  }

  @HostListener('window:click', ['$event'])
  clickOutside(event: Event): void {
    if (!this.self.nativeElement.contains(event.target)) {
      this.opened = false;
      this.focus = false;
    }
  }
}
