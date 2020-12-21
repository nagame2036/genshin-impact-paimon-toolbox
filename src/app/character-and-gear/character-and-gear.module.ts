import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {CharacterListComponent} from './components/character-list/character-list.component';
import {WeaponListComponent} from './components/weapon-list/weapon-list.component';
import {AscensionLevelSelectComponent} from './components/ascension-level-select/ascension-level-select.component';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {FlexModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    CharacterListComponent,
    WeaponListComponent,
    AscensionLevelSelectComponent
  ],
  imports: [
    SharedModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    FlexModule,
  ],
  exports: [
    CharacterListComponent,
    WeaponListComponent,
    AscensionLevelSelectComponent
  ]
})
export class CharacterAndGearModule {
}
