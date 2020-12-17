import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {CharacterStatRoutingModule} from './character-stat-routing.module';
import {CharacterStatPageComponent} from './pages/character-stat-page/character-stat-page.component';
import {CharacterStatProfileComponent} from './components/character-stat-profile/character-stat-profile.component';
import {CharacterStatAnalyzerComponent} from './components/character-stat-analyzer/character-stat-analyzer.component';
import {CharacterStatCalculatorComponent} from './components/character-stat-calculator/character-stat-calculator.component';
import {CharacterStatOptimizerComponent} from './components/character-stat-optimizer/character-stat-optimizer.component';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDividerModule} from '@angular/material/divider';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {FlexModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    CharacterStatPageComponent,
    CharacterStatProfileComponent,
    CharacterStatAnalyzerComponent,
    CharacterStatCalculatorComponent,
    CharacterStatOptimizerComponent
  ],
  imports: [
    SharedModule,
    CharacterStatRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatTabsModule,
    MatButtonModule,
    FlexModule
  ]
})
export class CharacterStatModule {
}
