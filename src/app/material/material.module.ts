import {NgModule} from '@angular/core';

import {WidgetModule} from '../widget/widget.module';
import {GameCommonModule} from '../game-common/game-common.module';
import {MaterialListComponent} from './components/material-list/material-list.component';
import {MaterialRequirementComponent} from './components/material-requirement/material-requirement.component';
import {MaterialDetailDialogComponent} from './components/material-detail-dialog/material-detail-dialog.component';
import {ExecutePlanConfirmDialogComponent} from './components/execute-plan-confirm-dialog/execute-plan-confirm-dialog.component';
import {CraftDialogComponent} from './components/craft-dialog/craft-dialog.component';

@NgModule({
  declarations: [
    MaterialListComponent,
    MaterialRequirementComponent,
    MaterialDetailDialogComponent,
    ExecutePlanConfirmDialogComponent,
    CraftDialogComponent,
  ],
  imports: [WidgetModule, GameCommonModule],
  exports: [
    MaterialListComponent,
    MaterialRequirementComponent,
    ExecutePlanConfirmDialogComponent,
  ],
})
export class MaterialModule {}
