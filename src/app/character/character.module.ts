import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {CharacterListComponent} from './components/character-list/character-list.component';
import {PartyCharacterListComponent} from './components/party-character-list/party-character-list.component';

@NgModule({
  declarations: [
    CharacterListComponent,
    PartyCharacterListComponent,
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    CharacterListComponent,
    PartyCharacterListComponent,
  ]
})
export class CharacterModule {
}
