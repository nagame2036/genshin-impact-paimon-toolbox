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
    path: '',
    component: InventoryPageComponent,
    children: [
      {path: '', redirectTo: 'character-material', pathMatch: 'full'},
      {
        path: 'character-material',
        component: CharacterMaterialInventoryComponent,
      },
      {path: 'talent-material', component: TalentMaterialInventoryComponent},
      {path: 'weapon-material', component: WeaponMaterialInventoryComponent},
      {path: 'enemy-material', component: EnemyMaterialInventoryComponent},
      {path: 'ingredients', component: IngredientInventoryComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
