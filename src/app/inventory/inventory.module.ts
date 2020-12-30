import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {MaterialModule} from '../material/material.module';
import {InventoryRoutingModule} from './inventory-routing.module';
import {InventoryPageComponent} from './pages/inventory-page/inventory-page.component';
import {InventoryItemViewComponent} from './components/inventory-item-view/inventory-item-view.component';
import {CharacterMaterialInventoryComponent} from './pages/character-material-inventory/character-material-inventory.component';
import {TalentMaterialInventoryComponent} from './pages/talent-material/talent-material-inventory.component';
import {WeaponMaterialInventoryComponent} from './pages/weapon-material-inventory/weapon-material-inventory.component';
import {CommonMaterialInventoryComponent} from './pages/common-material-inventory/common-material-inventory.component';
import {IngredientInventoryComponent} from './pages/ingredient-inventory/ingredient-inventory.component';

import {MatTabsModule} from '@angular/material/tabs';
import {FlexModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    InventoryPageComponent,
    InventoryItemViewComponent,
    CharacterMaterialInventoryComponent,
    TalentMaterialInventoryComponent,
    WeaponMaterialInventoryComponent,
    CommonMaterialInventoryComponent,
    IngredientInventoryComponent,
  ],
  imports: [
    SharedModule,
    MaterialModule,
    InventoryRoutingModule,
    MatTabsModule,
    FlexModule
  ]
})
export class InventoryModule {
}
