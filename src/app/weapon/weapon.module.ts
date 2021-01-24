import {NgModule} from '@angular/core';

import {WidgetModule} from '../widget/widget.module';
import {GameCommonModule} from '../game-common/game-common.module';
import {WeaponListComponent} from './components/weapon-list/weapon-list.component';
import {PartyWeaponListComponent} from './components/party-weapon-list/party-weapon-list.component';

@NgModule({
  declarations: [
    WeaponListComponent,
    PartyWeaponListComponent,
  ],
  imports: [
    WidgetModule,
    GameCommonModule,
  ],
  exports: [
    WeaponListComponent,
    PartyWeaponListComponent,
  ]
})
export class WeaponModule {
}
