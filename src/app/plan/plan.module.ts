import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';

import {PlanRoutingModule} from './plan-routing.module';
import {CharacterAndGearModule} from '../character-and-gear/character-and-gear.module';
import {MaterialModule} from '../material/material.module';


@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    CharacterAndGearModule,
    MaterialModule,
    PlanRoutingModule
  ]
})
export class PlanModule {
}
