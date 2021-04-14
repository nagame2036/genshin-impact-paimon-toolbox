import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddCharacterComponent} from './pages/add-character/add-character.component';
import {CharacterListComponent} from './pages/character-list/character-list.component';
import {CharacterDetailComponent} from './pages/character-detail/character-detail.component';
import {CharacterPlanComponent} from './pages/character-plan/character-plan.component';
import {CharacterSettingsComponent} from './pages/character-settings/character-settings.component';

const routes: Routes = [
  {path: '', redirectTo: 'progress', pathMatch: 'full'},
  {path: 'add', component: AddCharacterComponent},
  {path: 'progress', component: CharacterListComponent},
  {
    path: 'progress/:id',
    component: CharacterDetailComponent,
    children: [
      {path: '', redirectTo: 'plan', pathMatch: 'full'},
      {path: 'plan', component: CharacterPlanComponent},
    ],
  },
  {path: 'settings', component: CharacterSettingsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CharacterRoutingModule {}
