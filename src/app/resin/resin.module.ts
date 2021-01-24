import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {ResinRoutingModule} from './resin-routing.module';
import {ResinPageComponent} from './pages/resin-page/resin-page.component';
import {ResinReplenishCalculatorComponent} from './pages/resin-replenish-calculator/resin-replenish-calculator.component';

@NgModule({
  declarations: [
    ResinPageComponent,
    ResinReplenishCalculatorComponent
  ],
  imports: [
    SharedModule,
    ResinRoutingModule,
  ]
})
export class ResinModule {
}
