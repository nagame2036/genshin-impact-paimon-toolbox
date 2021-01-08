import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {CharacterModule} from '../character/character.module';
import {WeaponModule} from '../weapon/weapon.module';
import {PlanModule} from '../plan/plan.module';
import {PartyRoutingModule} from './party-routing.module';
import {PartyPageComponent} from './pages/party-page/party-page.component';
import {PartyCharacterComponent} from './pages/party-character/party-character.component';
import {AddCharacterDialogComponent} from './components/add-character-dialog/add-character-dialog.component';
import {CharacterDetailDialogComponent} from './components/character-detail-dialog/character-detail-dialog.component';
import {PartyWeaponComponent} from './pages/party-weapon/party-weapon.component';
import {AddWeaponDialogComponent} from './components/add-weapon-dialog/add-weapon-dialog.component';
import {WeaponDetailDialogComponent} from './components/weapon-detail-dialog/weapon-detail-dialog.component';
import {RemoveConfirmDialogComponent} from './components/remove-confirm-dialog/remove-confirm-dialog.component';

import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {FlexModule, GridModule} from '@angular/flex-layout';
import {MatDividerModule} from '@angular/material/divider';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [
    PartyPageComponent,
    PartyCharacterComponent,
    AddCharacterDialogComponent,
    CharacterDetailDialogComponent,
    PartyCharacterComponent,
    PartyWeaponComponent,
    AddWeaponDialogComponent,
    WeaponDetailDialogComponent,
    RemoveConfirmDialogComponent,
  ],
  imports: [
    SharedModule,
    CharacterModule,
    WeaponModule,
    PlanModule,
    PartyRoutingModule,
    MatTabsModule,
    MatButtonModule,
    MatDialogModule,
    FlexModule,
    GridModule,
    MatDividerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCheckboxModule,
  ]
})
export class PartyModule {
}
