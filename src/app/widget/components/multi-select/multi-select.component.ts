import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {SelectOption} from '../../models/select-option.model';
import {toggleItem} from '../../../shared/utils/collections';
import {TranslateService} from '@ngx-translate/core';
import {I18n} from '../../models/i18n.model';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
})
export class MultiSelectComponent implements OnInit {
  i18n = I18n.create('shared.multi-select');

  @Input()
  values!: any[];

  valuesText = '';

  @Input()
  options!: SelectOption[];

  optionsValues!: any[];

  @Input()
  ordered = false;

  @Output()
  changed = new EventEmitter<any[]>();

  hover = false;

  focus = false;

  opened = false;

  constructor(private self: ElementRef, private translator: TranslateService) {}

  ngOnInit(): void {
    this.optionsValues = this.options.map(it => it.value);
    this.updateValuesText();
  }

  change(option: SelectOption): void {
    const item = option.value;
    this.values = toggleItem(this.values, item, it => it === item);
    if (!this.ordered) {
      this.values.sort(
        (a, b) => this.optionsValues.indexOf(a) - this.optionsValues.indexOf(b),
      );
    }
    this.updateValuesText();
    this.changed.emit(this.values);
  }

  updateValuesText(): void {
    const length = this.values.length;
    if (length === 0) {
      this.valuesText = this.translator.instant(this.i18n.dict('none'));
    } else if (!this.ordered && length === this.options.length) {
      this.valuesText = this.translator.instant(this.i18n.dict('all'));
    } else {
      this.valuesText = this.values
        .map(it => {
          const index = this.optionsValues.indexOf(it);
          const text = this.options[index]?.text ?? '';
          return this.translator.instant(text);
        })
        .join(', ');
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event): void {
    if (!this.self.nativeElement.contains(event.target)) {
      this.opened = false;
      this.focus = false;
    }
  }

  selectAll(): void {
    this.values =
      this.values.length === this.options.length ? [] : this.optionsValues;
    this.updateValuesText();
    this.changed.emit(this.values);
  }
}
