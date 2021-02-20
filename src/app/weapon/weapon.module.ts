import {NgModule} from '@angular/core';

import {WidgetModule} from '../widget/widget.module';
import {GameCommonModule} from '../game-common/game-common.module';
import {WeaponRoutingModule} from './weapon-routing.module';
import {MaterialModule} from '../material/material.module';
import {AddWeaponComponent} from './pages/add-weapon/add-weapon.component';
import {WeaponListComponent} from './components/weapon-list/weapon-list.component';
import {WeaponInfoListComponent} from './components/weapon-info-list/weapon-info-list.component';
import {WeaponPageComponent} from './pages/weapon-page/weapon-page.component';
import {WeaponDetailComponent} from './pages/weapon-detail/weapon-detail.component';
import {WeaponPlanComponent} from './pages/weapon-plan/weapon-plan.component';
import {WeaponPlanFormComponent} from './components/weapon-plan-form/weapon-plan-form.component';
import {WeaponListHeaderComponent} from './components/weapon-list-header/weapon-list-header.component';

@NgModule({
  declarations: [
    AddWeaponComponent,
    WeaponListComponent,
    WeaponInfoListComponent,
    WeaponPageComponent,
    WeaponDetailComponent,
    WeaponPlanComponent,
    WeaponPlanFormComponent,
    WeaponListHeaderComponent,
  ],
  imports: [
    WidgetModule,
    GameCommonModule,
    MaterialModule,
    WeaponRoutingModule,
  ],
  exports: [
  ]
})
export class WeaponModule {
}
