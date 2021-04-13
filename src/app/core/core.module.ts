import {NgModule} from '@angular/core';

import {WidgetModule} from '../widget/widget.module';
import {HeaderComponent} from './layout/header/header.component';

@NgModule({
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
  imports: [WidgetModule],
})
export class CoreModule {}
