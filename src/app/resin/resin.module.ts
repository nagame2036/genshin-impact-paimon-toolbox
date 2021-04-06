import {NgModule} from '@angular/core';

import {WidgetModule} from '../widget/widget.module';
import {ResinRoutingModule} from './resin-routing.module';
import {ResinCalculatorComponent} from './pages/resin-calculator/resin-calculator.component';
import {DatetimePickerComponent} from './components/datetime-picker/datetime-picker.component';

@NgModule({
  declarations: [ResinCalculatorComponent, DatetimePickerComponent],
  imports: [WidgetModule, ResinRoutingModule],
})
export class ResinModule {}
