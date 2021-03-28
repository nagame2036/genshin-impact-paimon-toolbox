import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';

@Component({
  selector: 'app-item-grid-container',
  templateUrl: './item-grid-container.component.html',
  styleUrls: ['./item-grid-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemGridContainerComponent implements OnInit {
  i18n = I18n.create('game-common');

  @Input()
  colWidth = 102;

  @Input()
  type = '';

  @Input()
  clickText = '';

  @Input()
  doubleClickText = '';

  textParams!: any;

  @Input()
  hasSummary = false;

  constructor() {}

  ngOnInit(): void {
    this.textParams = {
      type: this.type,
      click: this.clickText,
      doubleClick: this.doubleClickText,
    };
  }
}
