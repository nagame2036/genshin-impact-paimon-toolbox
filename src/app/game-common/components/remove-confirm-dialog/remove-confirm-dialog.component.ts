import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DialogComponent} from '../../../widget/components/dialog/dialog.component';
import {I18n} from '../../../widget/models/i18n.model';
import {Rarity} from '../../models/rarity.type';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-remove-confirm-dialog',
  templateUrl: './remove-confirm-dialog.component.html',
  styleUrls: ['./remove-confirm-dialog.component.scss']
})
export class RemoveConfirmDialogComponent implements OnInit {

  i18n = new I18n('game-common');

  @Input()
  category!: string;

  @Input()
  items!: { id: number, rarity: Rarity }[];

  @Output()
  confirm = new EventEmitter();

  @ViewChild('dialog')
  dialog!: DialogComponent;

  constructor(private logger: NGXLogger) {
  }

  ngOnInit(): void {
    this.logger.info('init');
  }

  open(): void {
    this.dialog.open();
  }

  emitConfirm(): void {
    this.logger.info('confirmed');
    this.confirm.emit();
    this.dialog.close();
  }

}
