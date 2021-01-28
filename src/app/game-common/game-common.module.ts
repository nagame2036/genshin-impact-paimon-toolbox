import {NgModule} from '@angular/core';

import {WidgetModule} from '../widget/widget.module';
import {ItemViewComponent} from './components/item-view/item-view.component';
import {MultiSelectAndSelectAllComponent} from './components/multi-select-and-select-all/multi-select-and-select-all.component';
import {CurrentGoalSelectComponent} from './components/current-goal-select/current-goal-select.component';
import {CurrentGoalLevelSelectComponent} from './components/current-goal-level-select/current-goal-level-select.component';
import {RemoveConfirmDialogComponent} from './components/remove-confirm-dialog/remove-confirm-dialog.component';
import {ExecutePlanConfirmDialogComponent} from './components/execute-plan-confirm-dialog/execute-plan-confirm-dialog.component';
import {CurrentGoalComparatorComponent} from './components/current-goal-comparator/current-goal-comparator.component';

@NgModule({
  declarations: [
    ItemViewComponent,
    MultiSelectAndSelectAllComponent,
    CurrentGoalSelectComponent,
    CurrentGoalLevelSelectComponent,
    RemoveConfirmDialogComponent,
    ExecutePlanConfirmDialogComponent,
    CurrentGoalComparatorComponent,
  ],
  imports: [
    WidgetModule,
  ],
  exports: [
    ItemViewComponent,
    MultiSelectAndSelectAllComponent,
    CurrentGoalSelectComponent,
    CurrentGoalLevelSelectComponent,
    RemoveConfirmDialogComponent,
    ExecutePlanConfirmDialogComponent,
    CurrentGoalComparatorComponent,
  ]
})
export class GameCommonModule {
}
