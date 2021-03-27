import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';

@Component({
  selector: 'app-item-summary-not-select',
  templateUrl: './item-summary-not-select.component.html',
  styleUrls: ['./item-summary-not-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemSummaryNotSelectComponent implements OnInit {
  i18n = I18n.create('game-common');

  @Input()
  type = '';

  @Input()
  clickText = '';

  @Input()
  doubleClickText = '';

  textParams!: any;

  constructor() {}

  ngOnInit(): void {
    this.textParams = {
      type: this.type,
      click: this.clickText,
      doubleClick: this.doubleClickText,
    };
  }
}
