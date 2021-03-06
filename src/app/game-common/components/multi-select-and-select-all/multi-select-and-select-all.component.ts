import {Component, EventEmitter, Input, Output} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {MultiSelectEvent} from '../../models/multi-select-event.model';

@Component({
  selector: 'app-multi-select-and-select-all',
  templateUrl: './multi-select-and-select-all.component.html',
  styleUrls: ['./multi-select-and-select-all.component.scss'],
})
export class MultiSelectAndSelectAllComponent {
  i18n = I18n.create('shared.multi-select');

  @Input()
  multiSelect = false;

  @Input()
  selectAll = false;

  @Output()
  changed = new EventEmitter<MultiSelectEvent>();

  constructor() {}

  setMultiSelect(checked: boolean): void {
    if (!checked) {
      this.selectAll = false;
    }
    this.multiSelect = checked;
    this.emitChange();
  }

  setSelectAll(checked: boolean): void {
    if (checked) {
      this.multiSelect = true;
    }
    this.selectAll = checked;
    this.emitChange();
  }

  emitChange(): void {
    this.changed.emit({multiSelect: this.multiSelect, selectAll: this.selectAll});
  }
}
