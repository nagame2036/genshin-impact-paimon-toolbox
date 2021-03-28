import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {SelectOption} from '../../models/select-option.model';
import {SelectContainerComponent} from '../select-container/select-container.component';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnChanges {
  @Input()
  value!: any;

  valueText!: string;

  @Input()
  options!: SelectOption[];

  @Output()
  changed = new EventEmitter<any>();

  @ViewChild('container')
  container!: SelectContainerComponent;

  opened = false;

  constructor() {}

  get hover(): boolean {
    return this.container?.hover ?? false;
  }

  get focus(): boolean {
    return this.container?.focus ?? false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (['value', 'options'].some(it => changes.hasOwnProperty(it))) {
      this.changeValueText(this.value);
    }
  }

  change(option: SelectOption): void {
    const value = option.value;
    this.value = value;
    this.changeValueText(this.value);
    this.changed.emit(value);
    setTimeout(() => (this.opened = false), 10);
  }

  changeValueText(value: any): void {
    this.valueText = this.options?.find(it => it.value === value)?.text ?? '';
  }
}
