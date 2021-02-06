import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InventoryPageComponent} from './pages/inventory-page/inventory-page.component';
import {CharacterMaterialInventoryComponent} from './pages/character-material-inventory/character-material-inventory.component';
import {TalentMaterialInventoryComponent} from './pages/talent-material-inventory/talent-material-inventory.component';
import {WeaponMaterialInventoryComponent} from './pages/weapon-material-inventory/weapon-material-inventory.component';
import {EnemyMaterialInventoryComponent} from './pages/enemy-material-inventory/enemy-material-inventory.component';
import {IngredientInventoryComponent} from './pages/ingredient-inventory/ingredient-inventory.component';

const routes: Routes = [
  {
    path: '', component: InventoryPageComponent, children: [
      {path: '', redirectTo: 'character-materials', pathMatch: 'full'},
      {path: 'character-materials', component: CharacterMaterialInventoryComponent},
      {path: 'talent-materials', component: TalentMaterialInventoryComponent},
      {path: 'weapon-materials', component: WeaponMaterialInventoryComponent},
      {path: 'enemies-materials', component: EnemyMaterialInventoryComponent},
      {path: 'ingredients', component: IngredientInventoryComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule {
}
