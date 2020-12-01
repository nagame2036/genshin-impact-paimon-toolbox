import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {HeaderComponent} from './layout/header/header.component';
import {SidenavComponent} from './layout/sidenav/sidenav.component';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [HeaderComponent, SidenavComponent],
  exports: [
    HeaderComponent,
    SidenavComponent
  ],
  imports: [
    SharedModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class CoreModule {
}
