import {NgModule} from '@angular/core';

import {WidgetModule} from '../widget/widget.module';
import {MaterialModule} from '../material/material.module';
import {InventoryRoutingModule} from './inventory-routing.module';
import {InventoryPageComponent} from './pages/inventory-page/inventory-page.component';
import {CharacterMaterialInventoryComponent} from './pages/character-material-inventory/character-material-inventory.component';
import {TalentMaterialInventoryComponent} from './pages/talent-material-inventory/talent-material-inventory.component';
import {WeaponMaterialInventoryComponent} from './pages/weapon-material-inventory/weapon-material-inventory.component';
import {EnemyMaterialInventoryComponent} from './pages/enemy-material-inventory/enemy-material-inventory.component';
import {IngredientInventoryComponent} from './pages/ingredient-inventory/ingredient-inventory.component';
import {InventoryHeaderComponent} from './components/inventory-header/inventory-header.component';

@NgModule({
  declarations: [
    InventoryPageComponent,
    CharacterMaterialInventoryComponent,
    TalentMaterialInventoryComponent,
    WeaponMaterialInventoryComponent,
    EnemyMaterialInventoryComponent,
    IngredientInventoryComponent,
    InventoryHeaderComponent,
  ],
  imports: [WidgetModule, MaterialModule, InventoryRoutingModule],
})
export class InventoryModule {}
