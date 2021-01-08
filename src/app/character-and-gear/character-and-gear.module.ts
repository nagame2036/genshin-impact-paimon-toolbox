import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {AscensionLevelSelectComponent} from './components/ascension-level-select/ascension-level-select.component';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {FlexModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    AscensionLevelSelectComponent,
  ],
  imports: [
    SharedModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    FlexModule,
  ],
  exports: [
    AscensionLevelSelectComponent,
  ]
})
export class CharacterAndGearModule {
}
