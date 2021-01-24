import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {ItemViewComponent} from './components/item-view/item-view.component';
import {MultiSelectAndSelectAllComponent} from './components/multi-select-and-select-all/multi-select-and-select-all.component';
import {ParamsTranslatePipe} from './pipes/params-translate.pipe';
import {CheckboxComponent} from './components/checkbox/checkbox.component';
import {NavTabsComponent} from './components/nav-tabs/nav-tabs.component';
import {FormFieldComponent} from './components/form-field/form-field.component';
import {TextFieldComponent} from './components/text-field/text-field.component';
import {NumberFieldComponent} from './components/number-field/number-field.component';
import {SelectComponent} from './components/select/select.component';
import {MultiSelectComponent} from './components/multi-select/multi-select.component';
import {DialogComponent} from './components/dialog/dialog.component';
import {RingButtonComponent} from './components/ring-button/ring-button.component';

import {TranslateModule} from '@ngx-translate/core';
import {NgxIndexedDBModule} from 'ngx-indexed-db';

@NgModule({
  declarations: [
    ItemViewComponent,
    MultiSelectAndSelectAllComponent,
    ParamsTranslatePipe,
    CheckboxComponent,
    NavTabsComponent,
    FormFieldComponent,
    TextFieldComponent,
    NumberFieldComponent,
    SelectComponent,
    MultiSelectComponent,
    DialogComponent,
    RingButtonComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    NgxIndexedDBModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    NgxIndexedDBModule,
    ItemViewComponent,
    MultiSelectAndSelectAllComponent,
    ParamsTranslatePipe,
    CheckboxComponent,
    NavTabsComponent,
    FormFieldComponent,
    TextFieldComponent,
    NumberFieldComponent,
    SelectComponent,
    MultiSelectComponent,
    DialogComponent,
    RingButtonComponent,
  ]
})
export class SharedModule {
}
