import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InventoryPageComponent} from './pages/inventory-page/inventory-page.component';

const routes: Routes = [
  {path: '', component: InventoryPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule {
}
