import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InventoryPageComponent} from './pages/inventory-page/inventory-page.component';
import {MoraAndExpInventoryComponent} from './pages/mora-and-exp-inventory/mora-and-exp-inventory.component';
import {ElementalMaterialInventoryComponent} from './pages/elemental-material-inventory/elemental-material-inventory.component';
import {TalentMaterialInventoryComponent} from './pages/talent-material/talent-material-inventory.component';
import {WeaponMaterialInventoryComponent} from './pages/weapon-material-inventory/weapon-material-inventory.component';
import {CommonMaterialInventoryComponent} from './pages/common-material-inventory/common-material-inventory.component';
import {LocalSpecialtyInventoryComponent} from './pages/local-specialty-inventory/local-specialty-inventory.component';

const routes: Routes = [
  {
    path: '', component: InventoryPageComponent, children: [
      {path: '', redirectTo: 'mora-and-exp', pathMatch: 'full'},
      {path: 'mora-and-exp', component: MoraAndExpInventoryComponent},
      {path: 'elemental-materials', component: ElementalMaterialInventoryComponent},
      {path: 'talent-materials', component: TalentMaterialInventoryComponent},
      {path: 'weapon-materials', component: WeaponMaterialInventoryComponent},
      {path: 'common-materials', component: CommonMaterialInventoryComponent},
      {path: 'local-specialties', component: LocalSpecialtyInventoryComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule {
}
