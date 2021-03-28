import {NgModule} from '@angular/core';

import {WidgetModule} from '../widget/widget.module';
import {ItemViewComponent} from './components/item-view/item-view.component';
import {MultiSelectAndSelectAllComponent} from './components/multi-select-and-select-all/multi-select-and-select-all.component';
import {AscensionLevelSelectComponent} from './components/ascension-level-select/ascension-level-select.component';
import {CurrPlanSelectComponent} from './components/curr-plan-select/curr-plan-select.component';
import {CurrPlanLevelSelectComponent} from './components/curr-plan-level-select/curr-plan-level-select.component';
import {RemoveConfirmDialogComponent} from './components/remove-confirm-dialog/remove-confirm-dialog.component';
import {CurrPlanComparatorComponent} from './components/curr-plan-comparator/curr-plan-comparator.component';
import {ItemOverviewDataComponent} from './components/item-overview-data/item-overview-data.component';
import {ItemOverviewStatsDataComponent} from './components/item-overview-stats-data/item-overview-stats-data.component';
import {CurrPlanStatsComparatorComponent} from './components/curr-plan-stats-comparator/curr-plan-stats-comparator.component';
import {ItemGridContainerComponent} from './components/item-list-container/item-grid-container.component';

@NgModule({
  declarations: [
    ItemViewComponent,
    MultiSelectAndSelectAllComponent,
    AscensionLevelSelectComponent,
    CurrPlanSelectComponent,
    CurrPlanLevelSelectComponent,
    RemoveConfirmDialogComponent,
    CurrPlanComparatorComponent,
    ItemOverviewDataComponent,
    ItemOverviewStatsDataComponent,
    CurrPlanStatsComparatorComponent,
    ItemGridContainerComponent,
  ],
  imports: [WidgetModule],
  exports: [
    ItemViewComponent,
    MultiSelectAndSelectAllComponent,
    AscensionLevelSelectComponent,
    CurrPlanSelectComponent,
    CurrPlanLevelSelectComponent,
    RemoveConfirmDialogComponent,
    CurrPlanComparatorComponent,
    ItemOverviewDataComponent,
    ItemOverviewStatsDataComponent,
    CurrPlanStatsComparatorComponent,
    ItemGridContainerComponent,
  ],
})
export class GameCommonModule {}
