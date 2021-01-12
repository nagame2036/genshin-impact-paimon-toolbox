import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

import {ItemViewComponent} from './components/item-view/item-view.component';
import {MultiSelectComponent} from './components/multi-select/multi-select.component';
import {ParamsTranslatePipe} from './pipes/params-translate.pipe';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {NgxIndexedDBModule} from 'ngx-indexed-db';
import {FlexModule} from '@angular/flex-layout';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    ItemViewComponent,
    MultiSelectComponent,
    ParamsTranslatePipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxIndexedDBModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    FlexModule,
    MatCheckboxModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxIndexedDBModule,
    ItemViewComponent,
    MultiSelectComponent,
    ParamsTranslatePipe,
  ]
})
export class SharedModule {
}
