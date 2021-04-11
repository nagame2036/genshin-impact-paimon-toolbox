import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DialogComponent} from '../../../widget/components/dialog/dialog.component';
import {I18n} from '../../../widget/models/i18n.model';
import {NGXLogger} from 'ngx-logger';
import {ImageType} from '../../../image/services/image.service';
import {Item} from '../../models/item.model';

@Component({
  selector: 'app-remove-confirm-dialog',
  templateUrl: './remove-confirm-dialog.component.html',
  styleUrls: ['./remove-confirm-dialog.component.scss'],
})
export class RemoveConfirmDialogComponent implements OnInit {
  i18n = I18n.create('game-common');

  @Input()
  type!: ImageType;

  titleParams!: Record<string, string>;

  items: Item<any>[] = [];

  gridCols = '';

  @Output()
  confirm = new EventEmitter();

  @ViewChild('dialog')
  dialog!: DialogComponent;

  constructor(private logger: NGXLogger) {}

  ngOnInit(): void {
    this.titleParams = {type: this.i18n.pDict(this.type)};
  }

  open(items: Item<any>[]): void {
    this.items = items;
    const cols = Math.min(4, items.length);
    this.gridCols = cols <= 1 ? '' : `repeat(${cols}, 1fr)`;
    this.dialog.open();
  }

  emitConfirm(): void {
    this.logger.info('confirmed');
    this.confirm.emit();
    this.dialog.close();
  }
}
