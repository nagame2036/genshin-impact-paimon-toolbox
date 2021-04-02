import {NgModule} from '@angular/core';

import {WidgetModule} from '../widget/widget.module';
import {ResinRoutingModule} from './resin-routing.module';
import {ResinPageComponent} from './pages/resin-page/resin-page.component';
import {ResinReplenishTimeComponent} from './pages/resin-replenish-time/resin-replenish-time.component';

@NgModule({
  declarations: [ResinPageComponent, ResinReplenishTimeComponent],
  imports: [WidgetModule, ResinRoutingModule],
})
export class ResinModule {}
