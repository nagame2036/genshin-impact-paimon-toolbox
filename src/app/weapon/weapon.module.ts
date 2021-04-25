import {NgModule} from '@angular/core';

import {WidgetModule} from '../widget/widget.module';
import {GameCommonModule} from '../game-common/game-common.module';
import {WeaponRoutingModule} from './weapon-routing.module';
import {MaterialModule} from '../material/material.module';
import {AddWeaponComponent} from './pages/add-weapon/add-weapon.component';
import {WeaponGridComponent} from './components/weapon-grid/weapon-grid.component';
import {WeaponInfoGridComponent} from './components/weapon-info-grid/weapon-info-grid.component';
import {WeaponListComponent} from './pages/weapon-list/weapon-list.component';
import {WeaponDetailComponent} from './pages/weapon-detail/weapon-detail.component';
import {WeaponPlanComponent} from './pages/weapon-plan/weapon-plan.component';
import {WeaponPlanFormComponent} from './components/weapon-plan-form/weapon-plan-form.component';
import {WeaponViewOptionsComponent} from './components/weapon-view-options/weapon-view-options.component';

@NgModule({
  declarations: [
    AddWeaponComponent,
    WeaponGridComponent,
    WeaponInfoGridComponent,
    WeaponListComponent,
    WeaponDetailComponent,
    WeaponPlanComponent,
    WeaponPlanFormComponent,
    WeaponViewOptionsComponent,
  ],
  imports: [WidgetModule, GameCommonModule, MaterialModule, WeaponRoutingModule],
})
export class WeaponModule {}
