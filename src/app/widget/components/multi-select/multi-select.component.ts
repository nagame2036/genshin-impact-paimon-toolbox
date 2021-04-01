import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  value!: any[];

  valueText = '';

  @Input()
  options!: SelectOption[];

  optionsValues!: any[];

  @Input()
  ordered = false;

  @Output()
  changed = new EventEmitter<any[]>();

  constructor(private translator: TranslateService) {}

  ngOnInit(): void {
    this.optionsValues = this.options.map(it => it.value);
    this.updateValuesText();
  }

  change(option: SelectOption): void {
    const item = option.value;
    this.value = toggleItem(this.value, item, it => it === item);
    if (!this.ordered) {
      this.value.sort(
        (a, b) => this.optionsValues.indexOf(a) - this.optionsValues.indexOf(b),
      );
    }
    this.updateValuesText();
    this.changed.emit(this.value);
  }

  updateValuesText(): void {
    const length = this.value.length;
    if (length === 0) {
      this.valueText = this.translator.instant(this.i18n.dict('none'));
    } else if (!this.ordered && length === this.options.length) {
      this.valueText = this.translator.instant(this.i18n.dict('all'));
    } else {
      this.valueText = this.value
        .map(it => {
          const index = this.optionsValues.indexOf(it);
          const text = this.options[index]?.text ?? '';
          return this.translator.instant(text);
        })
        .join(', ');
    }
  }

  selectAll(): void {
    this.value =
      this.value.length === this.options.length ? [] : this.optionsValues;
    this.updateValuesText();
    this.changed.emit(this.value);
  }
}
