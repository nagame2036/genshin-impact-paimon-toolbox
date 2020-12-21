import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {MaterialModule} from '../material/material.module';
import {InventoryRoutingModule} from './inventory-routing.module';
import {InventoryPageComponent} from './pages/inventory-page/inventory-page.component';
import {MoraAndExpInventoryComponent} from './pages/mora-and-exp-inventory/mora-and-exp-inventory.component';

import {MatTabsModule} from '@angular/material/tabs';
import {FlexModule} from '@angular/flex-layout';
import {AmountInputComponent} from './components/amount-input/amount-input.component';

@NgModule({
  declarations: [
    InventoryPageComponent,
    AmountInputComponent,
    MoraAndExpInventoryComponent,
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
