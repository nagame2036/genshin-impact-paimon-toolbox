import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddWeaponComponent} from './pages/add-weapon/add-weapon.component';
import {WeaponListComponent} from './pages/weapon-list/weapon-list.component';
import {WeaponDetailComponent} from './pages/weapon-detail/weapon-detail.component';
import {WeaponPlanComponent} from './pages/weapon-plan/weapon-plan.component';

const routes: Routes = [
  {path: '', redirectTo: 'progresses', pathMatch: 'full'},
  {path: 'add', component: AddWeaponComponent},
  {path: 'progresses', component: WeaponListComponent},
  {
    path: 'progresses/:id',
    component: WeaponDetailComponent,
    children: [
      {path: '', redirectTo: 'plan', pathMatch: 'full'},
      {path: 'plan', component: WeaponPlanComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeaponRoutingModule {}
