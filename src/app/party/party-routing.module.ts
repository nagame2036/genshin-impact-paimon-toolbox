import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PartyPageComponent} from './pages/party-page/party-page.component';
import {PartyCharacterComponent} from './pages/party-character/party-character.component';
import {PartyWeaponComponent} from './pages/party-weapon/party-weapon.component';

const routes: Routes = [
  {
    path: '', component: PartyPageComponent, children: [
      {path: '', redirectTo: 'characters', pathMatch: 'full'},
      {path: 'characters', component: PartyCharacterComponent},
      {path: 'weapons', component: PartyWeaponComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyRoutingModule {
}
