import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsPageComponent} from './pages/settings-page/settings-page.component';

@NgModule({
  declarations: [SettingsPageComponent],
  imports: [
    SharedModule,
    SettingsRoutingModule,
  ]
})
export class SettingsModule {
}
