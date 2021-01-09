import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PartyPageComponent} from './pages/party-page/party-page.component';
import {PartyCharacterComponent} from './pages/party-character/party-character.component';
import {PartyCharacterAddComponent} from './pages/party-character-add/party-character-add.component';
import {PartyCharacterDetailComponent} from './pages/party-character-detail/party-character-detail.component';
import {PartyCharacterPlanComponent} from './pages/party-character-plan/party-character-plan.component';
import {PartyWeaponComponent} from './pages/party-weapon/party-weapon.component';
import {PartyWeaponAddComponent} from './pages/party-weapon-add/party-weapon-add.component';
import {PartyWeaponDetailComponent} from './pages/party-weapon-detail/party-weapon-detail.component';
import {PartyWeaponPlanComponent} from './pages/party-weapon-plan/party-weapon-plan.component';

const routes: Routes = [
  {
    path: '', component: PartyPageComponent, children: [
      {path: '', redirectTo: 'characters', pathMatch: 'full'},
      {path: 'characters', component: PartyCharacterComponent},
      {path: 'weapons', component: PartyWeaponComponent},
    ]
  },
  {
    path: 'add-character', component: PartyCharacterAddComponent
  },
  {
    path: 'characters/:id', component: PartyCharacterDetailComponent, children: [
      {path: '', redirectTo: 'plan', pathMatch: 'full'},
      {path: 'plan', component: PartyCharacterPlanComponent},
    ]
  },
  {
    path: 'add-weapon', component: PartyWeaponAddComponent
  },
  {
    path: 'weapons/:id', component: PartyWeaponDetailComponent, children: [
      {path: '', redirectTo: 'plan', pathMatch: 'full'},
      {path: 'plan', component: PartyWeaponPlanComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyRoutingModule {
}
