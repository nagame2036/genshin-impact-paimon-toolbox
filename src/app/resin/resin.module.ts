import {NgModule} from '@angular/core';

import {WidgetModule} from '../widget/widget.module';
import {ResinRoutingModule} from './resin-routing.module';
import {ResinPageComponent} from './pages/resin-page/resin-page.component';
import {ResinCalculatorComponent} from './pages/resin-calculator/resin-calculator.component';

@NgModule({
  declarations: [ResinPageComponent, ResinCalculatorComponent],
  imports: [WidgetModule, ResinRoutingModule],
})
export class ResinModule {}
