import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ResinPageComponent} from './pages/resin-page/resin-page.component';

const routes: Routes = [
  {path: '', component: ResinPageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResinRoutingModule {
}
