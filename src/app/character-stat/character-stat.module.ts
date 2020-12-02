import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {CharacterStatRoutingModule} from './character-stat-routing.module';
import {CharacterStatPageComponent} from './character-stat-page/character-stat-page.component';
import {CharacterStatFormComponent} from './character-stat-form/character-stat-form.component';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [CharacterStatPageComponent, CharacterStatFormComponent],
  imports: [
    SharedModule,
    CharacterStatRoutingModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class CharacterStatModule {
}
