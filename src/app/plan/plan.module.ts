import {NgModule} from '@angular/core';

import {PlanRoutingModule} from './plan-routing.module';
import {CharacterAndGearModule} from '../character-and-gear/character-and-gear.module';
import {CurrentGoalSelectComponent} from './components/current-goal-select/current-goal-select.component';
import {CurrentGoalLevelSelectComponent} from './components/current-goal-level-select/current-goal-level-select.component';
import {CharacterPlanFormComponent} from './components/character-plan-form/character-plan-form.component';
import {WeaponPlanFormComponent} from './components/weapon-plan-form/weapon-plan-form.component';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {SharedModule} from '../shared/shared.module';
import {FlexModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    CurrentGoalSelectComponent,
    CurrentGoalLevelSelectComponent,
    CharacterPlanFormComponent,
    WeaponPlanFormComponent,
  ],
  imports: [
    SharedModule,
    CharacterAndGearModule,
    PlanRoutingModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    FlexModule,
  ],
  exports: [
    CharacterPlanFormComponent,
    WeaponPlanFormComponent,
  ]
})
export class PlanModule {
}
