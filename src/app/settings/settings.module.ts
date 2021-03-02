import {NgModule} from '@angular/core';

import {WidgetModule} from '../widget/widget.module';
import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsPageComponent} from './pages/settings-page/settings-page.component';

@NgModule({
  declarations: [SettingsPageComponent],
  imports: [WidgetModule, SettingsRoutingModule],
})
export class SettingsModule {}
