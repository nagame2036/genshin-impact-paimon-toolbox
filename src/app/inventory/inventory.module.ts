import {NgModule} from '@angular/core';

import {WidgetModule} from '../widget/widget.module';
import {GameCommonModule} from '../game-common/game-common.module';
import {InventoryRoutingModule} from './inventory-routing.module';
import {InventoryPageComponent} from './pages/inventory-page/inventory-page.component';
import {InventoryListComponent} from './components/inventory-list/inventory-list.component';
import {MaterialRequirementComponent} from './components/material-requirement-list/material-requirement.component';
import {CharacterMaterialInventoryComponent} from './pages/character-material-inventory/character-material-inventory.component';
import {TalentMaterialInventoryComponent} from './pages/talent-material/talent-material-inventory.component';
import {WeaponMaterialInventoryComponent} from './pages/weapon-material-inventory/weapon-material-inventory.component';
import {EnemiesMaterialInventoryComponent} from './pages/enemies-material-inventory/enemies-material-inventory.component';
import {IngredientInventoryComponent} from './pages/ingredient-inventory/ingredient-inventory.component';
import {MaterialRequirementDialogComponent} from './components/material-requirement-dialog/material-requirement-dialog.component';
import {InventoryHeaderComponent} from './components/inventory-header/inventory-header.component';

@NgModule({
  declarations: [
    InventoryPageComponent,
    InventoryListComponent,
    MaterialRequirementComponent,
    CharacterMaterialInventoryComponent,
    TalentMaterialInventoryComponent,
    WeaponMaterialInventoryComponent,
    EnemiesMaterialInventoryComponent,
    IngredientInventoryComponent,
    MaterialRequirementDialogComponent,
    InventoryHeaderComponent,
  ],
  imports: [
    WidgetModule,
    GameCommonModule,
    InventoryRoutingModule,
  ],
  exports: [
    MaterialRequirementComponent,
  ]
})
export class InventoryModule {
}
