import {NgModule} from '@angular/core';

import {WidgetModule} from '../widget/widget.module';
import {GameCommonModule} from '../game-common/game-common.module';
import {CharacterRoutingModule} from './character-routing.module';
import {InventoryModule} from '../inventory/inventory.module';
import {AddCharacterComponent} from './pages/add-character/add-character.component';
import {CharacterListComponent} from './components/character-list/character-list.component';
import {PartyCharacterListComponent} from './components/party-character-list/party-character-list.component';
import {CharacterPageComponent} from './pages/character-page/character-page.component';
import {CharacterDetailComponent} from './pages/character-detail/character-detail.component';
import {CharacterPlanComponent} from './pages/character-plan/character-plan.component';
import {CharacterPlanFormComponent} from './components/character-plan-form/character-plan-form.component';

@NgModule({
  declarations: [
    AddCharacterComponent,
    CharacterListComponent,
    PartyCharacterListComponent,
    CharacterPageComponent,
    CharacterDetailComponent,
    CharacterPlanComponent,
    CharacterPlanFormComponent,
  ],
  imports: [
    WidgetModule,
    GameCommonModule,
    CharacterRoutingModule,
    InventoryModule,
  ],
  exports: [
    CharacterListComponent,
    PartyCharacterListComponent,
  ]
})
export class CharacterModule {
}
