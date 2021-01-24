import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {CharacterAndGearModule} from '../character-and-gear/character-and-gear.module';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    CharacterAndGearModule,
  ],
})
export class PlanModule {
}
