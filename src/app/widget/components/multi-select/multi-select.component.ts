import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SelectOption} from '../../models/select-option.model';
import {toggleItem} from '../../../shared/utils/collections';
import {TranslateService} from '@ngx-translate/core';
import {I18n} from '../../models/i18n.model';
import {AbstractObservableDirective} from '../../../shared/directives/abstract-observable.directive';
import {takeUntil} from 'rxjs/operators';
import {SettingService} from '../../../setting/services/setting.service';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
})
export class MultiSelectComponent extends AbstractObservableDirective implements OnInit {
  i18n = I18n.create('shared.multi-select');

  @Input()
  label = '';

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

  constructor(private translator: TranslateService, private settings: SettingService) {
    super();
  }

  ngOnInit(): void {
    this.optionsValues = this.options.map(it => it.value);
    this.updateValueText();
    this.settings.locale.pipe(takeUntil(this.destroy$)).subscribe(() => this.updateValueText());
  }

  change({value}: SelectOption): void {
    this.value = toggleItem(this.value, value, it => it === value);
    if (!this.ordered) {
      this.value.sort((a, b) => this.optionsValues.indexOf(a) - this.optionsValues.indexOf(b));
    }
    this.updateValueText();
    this.changed.emit(this.value);
  }

  updateValueText(): void {
    const length = this.value.length;
    if (length === 0) {
      this.valueText = this.translator.instant(this.i18n.dict('none'));
    } else if (!this.ordered && length === this.options.length) {
      this.valueText = this.translator.instant(this.i18n.dict('all'));
    } else {
      this.valueText = this.value
        .map(it => this.options[this.optionsValues.indexOf(it)]?.text ?? '')
        .map(it => this.translator.instant(it))
        .join(', ');
    }
  }

  selectAll(): void {
    this.value = this.value.length === this.options.length ? [] : this.optionsValues;
    this.updateValueText();
    this.changed.emit(this.value);
  }
}
