import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {MaterialModule} from '../material/material.module';
import {InventoryRoutingModule} from './inventory-routing.module';
import {InventoryPageComponent} from './pages/inventory-page/inventory-page.component';
import {MoraAndExpInventoryComponent} from './pages/mora-and-exp-inventory/mora-and-exp-inventory.component';

import {MatTabsModule} from '@angular/material/tabs';
import {FlexModule} from '@angular/flex-layout';
import {AmountInputComponent} from './components/amount-input/amount-input.component';
import {ElementalMaterialInventoryComponent} from './pages/elemental-material-inventory/elemental-material-inventory.component';
import {TalentMaterialInventoryComponent} from './pages/talent-material/talent-material-inventory.component';
import {WeaponMaterialInventoryComponent} from './pages/weapon-material-inventory/weapon-material-inventory.component';
import {CommonMaterialInventoryComponent} from './pages/common-material-inventory/common-material-inventory.component';
import {LocalSpecialtyInventoryComponent} from './pages/local-specialty-inventory/local-specialty-inventory.component';

@NgModule({
  declarations: [
    InventoryPageComponent,
    AmountInputComponent,
    MoraAndExpInventoryComponent,
    ElementalMaterialInventoryComponent,
    TalentMaterialInventoryComponent,
    WeaponMaterialInventoryComponent,
    CommonMaterialInventoryComponent,
    LocalSpecialtyInventoryComponent,
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
