import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {InventoryRoutingModule} from './inventory-routing.module';
import {InventoryPageComponent} from './pages/inventory-page/inventory-page.component';
import {InventoryListComponent} from './components/inventory-list/inventory-list.component';
import {MaterialsCostListComponent} from './components/materials-cost-list/materials-cost-list.component';
import {CharacterMaterialInventoryComponent} from './pages/character-material-inventory/character-material-inventory.component';
import {TalentMaterialInventoryComponent} from './pages/talent-material/talent-material-inventory.component';
import {WeaponMaterialInventoryComponent} from './pages/weapon-material-inventory/weapon-material-inventory.component';
import {CommonMaterialInventoryComponent} from './pages/common-material-inventory/common-material-inventory.component';
import {IngredientInventoryComponent} from './pages/ingredient-inventory/ingredient-inventory.component';
import {MaterialCostDetailDialogComponent} from './components/material-cost-detail-dialog/material-cost-detail-dialog.component';

import {MatTabsModule} from '@angular/material/tabs';
import {FlexModule, GridModule} from '@angular/flex-layout';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [
    InventoryPageComponent,
    InventoryListComponent,
    MaterialsCostListComponent,
    CharacterMaterialInventoryComponent,
    TalentMaterialInventoryComponent,
    WeaponMaterialInventoryComponent,
    CommonMaterialInventoryComponent,
    IngredientInventoryComponent,
    MaterialCostDetailDialogComponent,
  ],
  imports: [
    SharedModule,
    InventoryRoutingModule,
    MatTabsModule,
    FlexModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    ScrollingModule,
    GridModule,
    MatIconModule,
    MatDialogModule,
  ],
  exports: [
    MaterialsCostListComponent,
  ]
})
export class InventoryModule {
}
