import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {HeaderComponent} from './layout/header/header.component';
import {SidenavComponent} from './layout/sidenav/sidenav.component';

@NgModule({
  declarations: [HeaderComponent, SidenavComponent],
  exports: [
    HeaderComponent,
    SidenavComponent
  ],
  imports: [
    SharedModule,
  ]
})
export class CoreModule {
}
