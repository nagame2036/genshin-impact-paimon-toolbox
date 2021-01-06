import {NgModule} from '@angular/core';

import {PlanRoutingModule} from './plan-routing.module';
import {CharacterAndGearModule} from '../character-and-gear/character-and-gear.module';

@NgModule({
  declarations: [],
  imports: [
    CharacterAndGearModule,
    PlanRoutingModule
  ]
})
export class PlanModule {
}
