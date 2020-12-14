import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {PartyRoutingModule} from './party-routing.module';
import {PartyPageComponent} from './pages/party-page/party-page.component';
import {CharacterPartyComponent} from './pages/character-party/character-party.component';
import {CharacterListComponent} from './components/character-list/character-list.component';
import {CharacterListDialogComponent} from './components/character-list-dialog/character-list-dialog.component';
import {CharacterDetailDialogComponent} from './components/character-detail-dialog/character-detail-dialog.component';

import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {FlexModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    PartyPageComponent,
    CharacterPartyComponent,
    CharacterListComponent,
    CharacterListDialogComponent,
    CharacterDetailDialogComponent
  ],
  imports: [
    SharedModule,
    PartyRoutingModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FlexModule
  ]
})
export class PartyModule {
}
