import {NgModule} from '@angular/core';

import {WidgetModule} from '../widget/widget.module';
import {GameCommonModule} from '../game-common/game-common.module';
import {InventoryListComponent} from './components/inventory-list/inventory-list.component';
import {MaterialRequirementComponent} from './components/material-requirement/material-requirement.component';
import {MaterialRequirementDialogComponent} from './components/material-requirement-dialog/material-requirement-dialog.component';
import {ExecutePlanConfirmDialogComponent} from './components/execute-plan-confirm-dialog/execute-plan-confirm-dialog.component';

@NgModule({
  declarations: [
    InventoryListComponent,
    MaterialRequirementComponent,
    MaterialRequirementDialogComponent,
    ExecutePlanConfirmDialogComponent,
  ],
  imports: [
    WidgetModule,
    GameCommonModule,
  ],
  exports: [
    InventoryListComponent,
    MaterialRequirementComponent,
    MaterialRequirementDialogComponent,
    ExecutePlanConfirmDialogComponent,
  ]
})
export class MaterialModule {
}
