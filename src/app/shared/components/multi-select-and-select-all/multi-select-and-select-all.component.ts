import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {I18n} from '../../models/i18n.model';

@Component({
  selector: 'app-multi-select-and-select-all',
  templateUrl: './multi-select-and-select-all.component.html',
  styleUrls: ['./multi-select-and-select-all.component.scss']
})
export class MultiSelectAndSelectAllComponent implements OnInit {

  i18n = new I18n('shared.multi-select');

  @Input()
  multiSelect = false;

  @Input()
  selectAll = false;

  @Output()
  changed = new EventEmitter<{ multiSelect: boolean, selectAll: boolean }>();

  constructor() {
  }

  ngOnInit(): void {
  }

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
