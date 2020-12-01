import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsPageComponent} from './settings-page/settings-page.component';

import {MatDividerModule} from '@angular/material/divider';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatGridListModule} from '@angular/material/grid-list';

@NgModule({
  declarations: [SettingsPageComponent],
  imports: [
    SharedModule,
    SettingsRoutingModule,
    MatDividerModule,
    MatButtonToggleModule,
    MatGridListModule
  ]
})
export class SettingsModule {
}
