import {NgModule} from '@angular/core';

import {WidgetModule} from '../widget/widget.module';
import {HeaderComponent} from './layout/header/header.component';
import {SidenavComponent} from './layout/sidenav/sidenav.component';

@NgModule({
  declarations: [HeaderComponent, SidenavComponent],
  exports: [HeaderComponent, SidenavComponent],
  imports: [WidgetModule],
})
export class CoreModule {}
