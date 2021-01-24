import {NgModule} from '@angular/core';

import {WidgetModule} from '../widget/widget.module';
import {ItemViewComponent} from './components/item-view/item-view.component';
import {MultiSelectAndSelectAllComponent} from './components/multi-select-and-select-all/multi-select-and-select-all.component';

@NgModule({
  declarations: [
    ItemViewComponent,
    MultiSelectAndSelectAllComponent,
  ],
  imports: [
    WidgetModule,
  ],
  exports: [
    ItemViewComponent,
    MultiSelectAndSelectAllComponent,
  ]
})
export class GameCommonModule {
}
