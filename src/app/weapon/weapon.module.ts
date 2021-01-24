import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {WeaponListComponent} from './components/weapon-list/weapon-list.component';
import {PartyWeaponListComponent} from './components/party-weapon-list/party-weapon-list.component';

@NgModule({
  declarations: [
    WeaponListComponent,
    PartyWeaponListComponent,
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    WeaponListComponent,
    PartyWeaponListComponent,
  ]
})
export class WeaponModule {
}
