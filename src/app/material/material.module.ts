import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {MaterialListComponent} from './components/material-list/material-list.component';

import {FlexModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    MaterialListComponent
  ],
  imports: [
    SharedModule,
    FlexModule
  ],
  exports: [
    MaterialListComponent
  ]
})
export class MaterialModule {
}
