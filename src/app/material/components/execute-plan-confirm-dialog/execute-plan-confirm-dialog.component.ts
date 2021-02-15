import {Component, OnInit, ViewChild} from '@angular/core';
import {DialogComponent} from '../../../widget/components/dialog/dialog.component';
import {I18n} from '../../../widget/models/i18n.model';
import {Observable, Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {MaterialDetail} from '../../models/material.model';

@Component({
  selector: 'app-execute-plan-confirm-dialog',
  templateUrl: './execute-plan-confirm-dialog.component.html',
  styleUrls: ['./execute-plan-confirm-dialog.component.scss']
})
export class ExecutePlanConfirmDialogComponent implements OnInit {

  i18n = new I18n('game-common');

  data: { item: string; title: string; requirement: MaterialDetail[] } = {item: '', title: '', requirement: []};

  private confirm$!: Subject<any>;

  @ViewChild('dialog')
  dialog!: DialogComponent;

  constructor(private logger: NGXLogger) {
  }

  ngOnInit(): void {
    this.logger.info('init');
  }

  open(data: { item: string, title: string, requirement: MaterialDetail[] }): ExecutePlanConfirmDialogComponent {
    this.logger.info('open with data', data);
    this.data = data;
    this.dialog.open();
    this.confirm$ = new Subject();
    return this;
  }

  confirm(): void {
    this.logger.info('confirmed');
    this.confirm$.next();
    this.confirm$.complete();
    this.dialog.close();
  }

  afterConfirm(): Observable<any> {
    return this.confirm$;
  }
}
