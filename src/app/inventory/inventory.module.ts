import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {InventoryRoutingModule} from './inventory-routing.module';
import {InventoryPageComponent} from './pages/inventory-page/inventory-page.component';
import {AmountInputComponent} from './components/amount-input/amount-input.component';
import {MoraAndExpInventoryComponent} from './pages/mora-and-exp-inventory/mora-and-exp-inventory.component';
import {MaterialListComponent} from './components/material-list/material-list.component';

import {MatTabsModule} from '@angular/material/tabs';
import {FlexModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    InventoryPageComponent,
    AmountInputComponent,
    MoraAndExpInventoryComponent,
    MaterialListComponent
  ],
  imports: [
    SharedModule,
    InventoryRoutingModule,
    MatTabsModule,
    FlexModule
  ]
})
export class InventoryModule {
}
