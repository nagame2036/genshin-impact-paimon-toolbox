import {NgModule} from '@angular/core';

import {WidgetModule} from '../widget/widget.module';
import {GameCommonModule} from '../game-common/game-common.module';
import {CharacterRoutingModule} from './character-routing.module';
import {MaterialModule} from '../material/material.module';
import {AddCharacterComponent} from './pages/add-character/add-character.component';
import {CharacterGridComponent} from './components/character-grid/character-grid.component';
import {CharacterInfoGridComponent} from './components/character-info-grid/character-info-grid.component';
import {CharacterListComponent} from './pages/character-list/character-list.component';
import {CharacterDetailComponent} from './pages/character-detail/character-detail.component';
import {CharacterPlanComponent} from './pages/character-plan/character-plan.component';
import {CharacterPlanFormComponent} from './components/character-plan-form/character-plan-form.component';
import {CharacterViewOptionsComponent} from './components/character-view-options/character-view-options.component';
import {CharacterSettingsComponent} from './pages/character-settings/character-settings.component';

@NgModule({
  declarations: [
    AddCharacterComponent,
    CharacterGridComponent,
    CharacterInfoGridComponent,
    CharacterListComponent,
    CharacterDetailComponent,
    CharacterPlanComponent,
    CharacterPlanFormComponent,
    CharacterViewOptionsComponent,
    CharacterSettingsComponent,
  ],
  imports: [WidgetModule, GameCommonModule, MaterialModule, CharacterRoutingModule],
})
export class CharacterModule {}
