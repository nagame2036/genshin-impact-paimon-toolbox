import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {SharedModule} from '../shared/shared.module';
import {ResinRoutingModule} from './resin-routing.module';
import {ResinPageComponent} from './resin-page/resin-page.component';
import {ResinReplenishCalculatorComponent} from './resin-replenish-calculator/resin-replenish-calculator.component';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [ResinPageComponent, ResinReplenishCalculatorComponent],
  imports: [
    SharedModule,
    ResinRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class ResinModule {
}
