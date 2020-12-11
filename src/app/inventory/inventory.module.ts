import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {InventoryRoutingModule} from './inventory-routing.module';
import {InventoryPageComponent} from './pages/inventory-page/inventory-page.component';
import {AmountInputComponent} from './components/listening-input/amount-input.component';
import {InventoryCommonMaterialsComponent} from './pages/inventory-common-materials/inventory-common-materials.component';

import {MatTabsModule} from '@angular/material/tabs';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [
    InventoryPageComponent,
    AmountInputComponent,
    InventoryCommonMaterialsComponent
  ],
  imports: [
    SharedModule,
    InventoryRoutingModule,
    MatTabsModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class InventoryModule {
}
