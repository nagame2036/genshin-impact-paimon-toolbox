import {NgModule} from '@angular/core';

import {WidgetModule} from '../widget/widget.module';
import {SettingRoutingModule} from './setting-routing.module';
import {SettingPageComponent} from './pages/setting-page/setting-page.component';

@NgModule({
  declarations: [SettingPageComponent],
  imports: [WidgetModule, SettingRoutingModule],
})
export class SettingModule {}
