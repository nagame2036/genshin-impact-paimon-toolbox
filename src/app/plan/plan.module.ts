import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {CharacterAndGearModule} from '../character-and-gear/character-and-gear.module';
import {PlanRoutingModule} from './plan-routing.module';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    CharacterAndGearModule,
    PlanRoutingModule,
  ],
})
export class PlanModule {
}
