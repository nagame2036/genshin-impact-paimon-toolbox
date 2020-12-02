import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {CharacterStatRoutingModule} from './character-stat-routing.module';
import {CharacterStatPageComponent} from './character-stat-page/character-stat-page.component';
import {CharacterStatProfileComponent} from './character-stat-profile/character-stat-profile.component';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDividerModule} from '@angular/material/divider';

@NgModule({
  declarations: [
    CharacterStatPageComponent,
    CharacterStatProfileComponent
  ],
  imports: [
    SharedModule,
    CharacterStatRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule
  ]
})
export class CharacterStatModule {
}
