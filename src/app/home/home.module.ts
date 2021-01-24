import {NgModule} from '@angular/core';

import {WidgetModule} from '../widget/widget.module';
import {HomeRoutingModule} from './home-routing.module';
import {HomePageComponent} from './pages/home-page/home-page.component';

@NgModule({
  declarations: [HomePageComponent],
  imports: [
    WidgetModule,
    HomeRoutingModule,
  ]
})
export class HomeModule {
}
