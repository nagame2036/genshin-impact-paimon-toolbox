import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {CharacterModule} from '../character/character.module';
import {WeaponModule} from '../weapon/weapon.module';
import {PlanModule} from '../plan/plan.module';
import {PartyRoutingModule} from './party-routing.module';
import {InventoryModule} from '../inventory/inventory.module';
import {CurrentGoalSelectComponent} from './components/current-goal-select/current-goal-select.component';
import {CurrentGoalLevelSelectComponent} from './components/current-goal-level-select/current-goal-level-select.component';
import {PartyPageComponent} from './pages/party-page/party-page.component';
import {PartyCharacterComponent} from './pages/party-character/party-character.component';
import {PartyCharacterAddComponent} from './pages/party-character-add/party-character-add.component';
import {PartyCharacterDetailComponent} from './pages/party-character-detail/party-character-detail.component';
import {PartyCharacterPlanComponent} from './pages/party-character-plan/party-character-plan.component';
import {CharacterPlanFormComponent} from './components/character-plan-form/character-plan-form.component';
import {PartyWeaponComponent} from './pages/party-weapon/party-weapon.component';
import {PartyWeaponAddComponent} from './pages/party-weapon-add/party-weapon-add.component';
import {PartyWeaponDetailComponent} from './pages/party-weapon-detail/party-weapon-detail.component';
import {PartyWeaponPlanComponent} from './pages/party-weapon-plan/party-weapon-plan.component';
import {WeaponPlanFormComponent} from './components/weapon-plan-form/weapon-plan-form.component';
import {RemoveConfirmDialogComponent} from './components/remove-confirm-dialog/remove-confirm-dialog.component';
import {ExecutePlanConfirmDialogComponent} from './components/execute-plan-confirm-dialog/execute-plan-confirm-dialog.component';

import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {FlexModule, GridModule} from '@angular/flex-layout';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {ScrollingModule} from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    PartyPageComponent,
    CurrentGoalSelectComponent,
    CurrentGoalLevelSelectComponent,
    PartyCharacterComponent,
    PartyCharacterAddComponent,
    PartyCharacterDetailComponent,
    PartyCharacterPlanComponent,
    CharacterPlanFormComponent,
    PartyWeaponComponent,
    PartyWeaponAddComponent,
    PartyWeaponDetailComponent,
    PartyWeaponPlanComponent,
    WeaponPlanFormComponent,
    RemoveConfirmDialogComponent,
    ExecutePlanConfirmDialogComponent,
  ],
  imports: [
    SharedModule,
    CharacterModule,
    WeaponModule,
    PlanModule,
    PartyRoutingModule,
    InventoryModule,
    MatTabsModule,
    MatButtonModule,
    MatDialogModule,
    FlexModule,
    GridModule,
    MatSelectModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatIconModule,
    ScrollingModule,
  ]
})
export class PartyModule {
}
