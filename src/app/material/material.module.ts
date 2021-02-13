import {NgModule} from '@angular/core';

import {WidgetModule} from '../widget/widget.module';
import {GameCommonModule} from '../game-common/game-common.module';
import {MaterialListComponent} from './components/material-list/material-list.component';
import {MaterialRequirementComponent} from './components/material-requirement/material-requirement.component';
import {MaterialRequirementDialogComponent} from './components/material-requirement-dialog/material-requirement-dialog.component';
import {ExecutePlanConfirmDialogComponent} from './components/execute-plan-confirm-dialog/execute-plan-confirm-dialog.component';
import {CraftDialogComponent} from './components/craft-dialog/craft-dialog.component';

@NgModule({
  declarations: [
    MaterialListComponent,
    MaterialRequirementComponent,
    MaterialRequirementDialogComponent,
    ExecutePlanConfirmDialogComponent,
    CraftDialogComponent,
  ],
  imports: [
    WidgetModule,
    GameCommonModule,
  ],
  exports: [
    MaterialListComponent,
    MaterialRequirementComponent,
    ExecutePlanConfirmDialogComponent,
  ]
})
export class MaterialModule {
}
