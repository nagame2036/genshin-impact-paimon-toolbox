import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {CharacterListComponent} from './components/character-list/character-list.component';
import {PartyCharacterListComponent} from './components/party-character-list/party-character-list.component';

import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {FlexModule, GridModule} from '@angular/flex-layout';
import {ScrollingModule} from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    CharacterListComponent,
    PartyCharacterListComponent,
  ],
  imports: [
    SharedModule,
    MatSelectModule,
    MatButtonModule,
    FlexModule,
    GridModule,
    ScrollingModule,
  ],
  exports: [
    CharacterListComponent,
    PartyCharacterListComponent,
  ]
})
export class CharacterModule {
}
