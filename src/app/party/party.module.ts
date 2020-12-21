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
import {PartyCharacterListComponent} from './components/party-character-list/party-character-list.component';
import {PartyWeaponListComponent} from './components/party-weapon-list/party-weapon-list.component';
import {RemoveConfirmDialogComponent} from './components/remove-confirm-dialog/remove-confirm-dialog.component';
import {CurrentTargetSelectComponent} from './components/current-target-select/current-target-select.component';
import {CurrentTargetLevelSelectComponent} from './components/current-target-level-select/current-target-level-select.component';

import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {FlexModule, GridModule} from '@angular/flex-layout';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';

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
    WeaponDetailDialogComponent,
    PartyCharacterListComponent,
    PartyWeaponListComponent,
    RemoveConfirmDialogComponent,
    CurrentTargetSelectComponent,
    CurrentTargetLevelSelectComponent
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
    MatSnackBarModule,
    MatCheckboxModule
  ]
})
export class PartyModule {
}
