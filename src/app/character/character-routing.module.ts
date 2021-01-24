import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddCharacterComponent} from './pages/add-character/add-character.component';
import {CharacterPageComponent} from './pages/character-page/character-page.component';
import {CharacterDetailComponent} from './pages/character-detail/character-detail.component';
import {CharacterPlanComponent} from './pages/character-plan/character-plan.component';

const routes: Routes = [
  {path: '', component: CharacterPageComponent},
  {path: 'add', component: AddCharacterComponent},
  {
    path: ':id', component: CharacterDetailComponent, children: [
      {path: '', redirectTo: 'plan', pathMatch: 'full'},
      {path: 'plan', component: CharacterPlanComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CharacterRoutingModule {
}
