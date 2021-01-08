import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {WeaponListComponent} from './components/weapon-list/weapon-list.component';
import {PartyWeaponListComponent} from './components/party-weapon-list/party-weapon-list.component';

import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {FlexModule, GridModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    WeaponListComponent,
    PartyWeaponListComponent,
  ],
  imports: [
    SharedModule,
    MatSelectModule,
    MatButtonModule,
    FlexModule,
    GridModule,
  ],
  exports: [
    WeaponListComponent,
    PartyWeaponListComponent,
  ]
})
export class WeaponModule {
}
