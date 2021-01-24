import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {InventoryRoutingModule} from './inventory-routing.module';
import {InventoryPageComponent} from './pages/inventory-page/inventory-page.component';
import {InventoryListComponent} from './components/inventory-list/inventory-list.component';
import {MaterialCostListComponent} from './components/material-cost-list/material-cost-list.component';
import {CharacterMaterialInventoryComponent} from './pages/character-material-inventory/character-material-inventory.component';
import {TalentMaterialInventoryComponent} from './pages/talent-material/talent-material-inventory.component';
import {WeaponMaterialInventoryComponent} from './pages/weapon-material-inventory/weapon-material-inventory.component';
import {EnemiesMaterialInventoryComponent} from './pages/enemies-material-inventory/enemies-material-inventory.component';
import {IngredientInventoryComponent} from './pages/ingredient-inventory/ingredient-inventory.component';
import {MaterialCostDetailDialogComponent} from './components/material-cost-detail-dialog/material-cost-detail-dialog.component';
import {InventoryHeaderComponent} from './components/inventory-header/inventory-header.component';

@NgModule({
  declarations: [
    InventoryPageComponent,
    InventoryListComponent,
    MaterialCostListComponent,
    CharacterMaterialInventoryComponent,
    TalentMaterialInventoryComponent,
    WeaponMaterialInventoryComponent,
    EnemiesMaterialInventoryComponent,
    IngredientInventoryComponent,
    MaterialCostDetailDialogComponent,
    InventoryHeaderComponent,
  ],
  imports: [
    SharedModule,
    InventoryRoutingModule,
  ],
  exports: [
    MaterialCostListComponent,
  ]
})
export class InventoryModule {
}
