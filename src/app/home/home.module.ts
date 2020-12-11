import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {HomeRoutingModule} from './home-routing.module';
import {HomePageComponent} from './pages/home-page/home-page.component';

import {MatDividerModule} from '@angular/material/divider';

@NgModule({
  declarations: [HomePageComponent],
  imports: [
    SharedModule,
    HomeRoutingModule,
    MatDividerModule
  ]
})
export class HomeModule {
}
