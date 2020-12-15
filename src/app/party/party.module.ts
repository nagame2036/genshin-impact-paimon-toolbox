import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {PartyRoutingModule} from './party-routing.module';
import {PartyPageComponent} from './pages/party-page/party-page.component';
import {PartyCharacterComponent} from './pages/party-character/party-character.component';
import {CharacterListComponent} from './components/character-list/character-list.component';
import {CharacterSelectDialogComponent} from './components/character-select-dialog/character-select-dialog.component';
import {CharacterDetailDialogComponent} from './components/character-detail-dialog/character-detail-dialog.component';
import {PartyWeaponComponent} from './pages/party-weapon/party-weapon.component';
import {WeaponListComponent} from './components/weapon-list/weapon-list.component';
import {WeaponSelectDialogComponent} from './components/weapon-select-dialog/weapon-select-dialog.component';
import {WeaponDetailDialogComponent} from './components/weapon-detail-dialog/weapon-detail-dialog.component';

import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {FlexModule, GridModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    PartyPageComponent,
    PartyCharacterComponent,
    CharacterListComponent,
    CharacterSelectDialogComponent,
    CharacterDetailDialogComponent,
    PartyCharacterComponent,
    PartyWeaponComponent,
    WeaponListComponent,
    WeaponSelectDialogComponent,
    WeaponDetailDialogComponent
  ],
  imports: [
    SharedModule,
    PartyRoutingModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FlexModule,
    GridModule
  ]
})
export class PartyModule {
}
