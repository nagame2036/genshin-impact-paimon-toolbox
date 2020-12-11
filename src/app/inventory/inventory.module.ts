import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {InventoryRoutingModule} from './inventory-routing.module';
import {InventoryPageComponent} from './pages/inventory-page/inventory-page.component';
import {AmountInputComponent} from './components/amount-input/amount-input.component';
import {InventoryCommonMaterialsComponent} from './pages/inventory-common-materials/inventory-common-materials.component';
import {InventorySpecialMaterialsComponent} from './pages/inventory-special-materials/inventory-special-materials.component';

import {MatTabsModule} from '@angular/material/tabs';
import {MatGridListModule} from '@angular/material/grid-list';

@NgModule({
  declarations: [
    InventoryPageComponent,
    AmountInputComponent,
    InventoryCommonMaterialsComponent,
    InventorySpecialMaterialsComponent
  ],
  imports: [
    SharedModule,
    InventoryRoutingModule,
    MatTabsModule,
    MatGridListModule
  ]
})
export class InventoryModule {
}
