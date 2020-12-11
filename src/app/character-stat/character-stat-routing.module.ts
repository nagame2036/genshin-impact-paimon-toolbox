import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CharacterStatPageComponent} from './pages/character-stat-page/character-stat-page.component';

const routes: Routes = [
  {path: '', component: CharacterStatPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CharacterStatRoutingModule {
}
