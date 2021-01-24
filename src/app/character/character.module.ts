import {NgModule} from '@angular/core';

import {WidgetModule} from '../widget/widget.module';
import {GameCommonModule} from '../game-common/game-common.module';
import {CharacterListComponent} from './components/character-list/character-list.component';
import {PartyCharacterListComponent} from './components/party-character-list/party-character-list.component';

@NgModule({
  declarations: [
    CharacterListComponent,
    PartyCharacterListComponent,
  ],
  imports: [
    WidgetModule,
    GameCommonModule,
  ],
  exports: [
    CharacterListComponent,
    PartyCharacterListComponent,
  ]
})
export class CharacterModule {
}
