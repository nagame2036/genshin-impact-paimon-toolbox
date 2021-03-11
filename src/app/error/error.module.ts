import {NgModule} from '@angular/core';

import {ErrorRoutingModule} from './error-routing.module';
import {NotFoundPageComponent} from './pages/not-found-page/not-found-page.component';
import {WidgetModule} from '../widget/widget.module';

@NgModule({
  declarations: [NotFoundPageComponent],
  imports: [WidgetModule, ErrorRoutingModule],
})
export class ErrorModule {}
