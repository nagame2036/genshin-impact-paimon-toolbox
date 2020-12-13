import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {InventoryRoutingModule} from './inventory-routing.module';
import {InventoryPageComponent} from './pages/inventory-page/inventory-page.component';
import {AmountInputComponent} from './components/amount-input/amount-input.component';
import {MoraAndExpInventoryComponent} from './pages/mora-and-exp-inventory/mora-and-exp-inventory.component';
import {MaterialsInventoryComponent} from './pages/materials-inventory/materials-inventory.component';

import {MatTabsModule} from '@angular/material/tabs';
import {MatGridListModule} from '@angular/material/grid-list';

@NgModule({
  declarations: [
    InventoryPageComponent,
    AmountInputComponent,
    MoraAndExpInventoryComponent,
    MaterialsInventoryComponent
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
