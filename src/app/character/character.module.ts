import {NgModule} from '@angular/core';

import {WidgetModule} from '../widget/widget.module';
import {GameCommonModule} from '../game-common/game-common.module';
import {CharacterRoutingModule} from './character-routing.module';
import {MaterialModule} from '../material/material.module';
import {AddCharacterComponent} from './pages/add-character/add-character.component';
import {CharacterListComponent} from './components/character-list/character-list.component';
import {CharacterInfoListComponent} from './components/character-info-list/character-info-list.component';
import {CharacterListPageComponent} from './pages/character-list-page/character-list-page.component';
import {CharacterDetailComponent} from './pages/character-detail/character-detail.component';
import {CharacterPlanComponent} from './pages/character-plan/character-plan.component';
import {CharacterPlanFormComponent} from './components/character-plan-form/character-plan-form.component';
import {CharacterListOptionsComponent} from './components/character-list-options/character-list-options.component';
import {CharacterSettingsComponent} from './pages/character-settings/character-settings.component';

@NgModule({
  declarations: [
    AddCharacterComponent,
    CharacterListComponent,
    CharacterInfoListComponent,
    CharacterListPageComponent,
    CharacterDetailComponent,
    CharacterPlanComponent,
    CharacterPlanFormComponent,
    CharacterListOptionsComponent,
    CharacterSettingsComponent,
  ],
  imports: [
    WidgetModule,
    GameCommonModule,
    MaterialModule,
    CharacterRoutingModule,
  ],
  exports: [],
})
export class CharacterModule {}
