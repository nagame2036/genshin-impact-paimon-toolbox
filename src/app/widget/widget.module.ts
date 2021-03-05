import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';

import {CheckboxComponent} from './components/checkbox/checkbox.component';
import {DialogComponent} from './components/dialog/dialog.component';
import {FormFieldComponent} from './components/form-field/form-field.component';
import {TextFieldComponent} from './components/text-field/text-field.component';
import {NumberFieldComponent} from './components/number-field/number-field.component';
import {SelectComponent} from './components/select/select.component';
import {MultiSelectComponent} from './components/multi-select/multi-select.component';
import {RingButtonComponent} from './components/ring-button/ring-button.component';
import {NavTabsComponent} from './components/nav-tabs/nav-tabs.component';
import {SliderComponent} from './components/slider/slider.component';

@NgModule({
  declarations: [
    CheckboxComponent,
    DialogComponent,
    FormFieldComponent,
    TextFieldComponent,
    NumberFieldComponent,
    SelectComponent,
    MultiSelectComponent,
    RingButtonComponent,
    NavTabsComponent,
    SliderComponent,
  ],
  imports: [SharedModule],
  exports: [
    SharedModule,
    CheckboxComponent,
    DialogComponent,
    FormFieldComponent,
    TextFieldComponent,
    NumberFieldComponent,
    SelectComponent,
    MultiSelectComponent,
    RingButtonComponent,
    NavTabsComponent,
    SliderComponent,
  ],
})
export class WidgetModule {}
