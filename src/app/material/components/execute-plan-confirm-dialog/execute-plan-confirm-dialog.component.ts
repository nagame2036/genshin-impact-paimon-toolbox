import {Component, ViewChild} from '@angular/core';
import {DialogComponent} from '../../../widget/components/dialog/dialog.component';
import {I18n} from '../../../widget/models/i18n.model';
import {Observable, Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {MaterialDetail} from '../../models/material.model';

type PlanData = {
  item: string;
  title: string;
  requirement: MaterialDetail[];
};

type DialogData = Omit<PlanData, 'title'> & {plan: string};

@Component({
  selector: 'app-execute-plan-confirm-dialog',
  templateUrl: './execute-plan-confirm-dialog.component.html',
  styleUrls: ['./execute-plan-confirm-dialog.component.scss'],
})
export class ExecutePlanConfirmDialogComponent {
  i18n = I18n.create('game-common');

  data: DialogData = {item: '', plan: '', requirement: []};

  @ViewChild('dialog')
  dialog!: DialogComponent;

  private confirm$!: Subject<unknown>;

  constructor(private logger: NGXLogger) {}

  open(data: PlanData): ExecutePlanConfirmDialogComponent {
    this.logger.info('open with data', data);
    const {item, title, requirement} = data;
    this.data = {item: this.i18n.param(item), plan: this.i18n.param(title), requirement};
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

  afterConfirm(): Observable<unknown> {
    return this.confirm$;
  }
}
