import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {PartyRoutingModule} from './party-routing.module';
import {PartyPageComponent} from './pages/party-page/party-page.component';
import {PartyCharacterComponent} from './pages/party-character/party-character.component';
import {CharacterListComponent} from './components/character-list/character-list.component';
import {AddCharacterDialogComponent} from './components/add-character-dialog/add-character-dialog.component';
import {CharacterDetailDialogComponent} from './components/character-detail-dialog/character-detail-dialog.component';
import {PartyWeaponComponent} from './pages/party-weapon/party-weapon.component';
import {WeaponListComponent} from './components/weapon-list/weapon-list.component';
import {AddWeaponDialogComponent} from './components/add-weapon-dialog/add-weapon-dialog.component';
import {WeaponDetailDialogComponent} from './components/weapon-detail-dialog/weapon-detail-dialog.component';

import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {FlexModule, GridModule} from '@angular/flex-layout';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    PartyPageComponent,
    PartyCharacterComponent,
    CharacterListComponent,
    AddCharacterDialogComponent,
    CharacterDetailDialogComponent,
    PartyCharacterComponent,
    PartyWeaponComponent,
    WeaponListComponent,
    AddWeaponDialogComponent,
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
    GridModule,
    MatDividerModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule
  ]
})
export class PartyModule {
}
