import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';

import {CheckboxComponent} from './components/checkbox/checkbox.component';
import {DialogComponent} from './components/dialog/dialog.component';
import {FormFieldComponent} from './components/form-field/form-field.component';
import {InputFieldComponent} from './components/input-field/input-field.component';
import {NumberFieldComponent} from './components/number-field/number-field.component';
import {SelectComponent} from './components/select/select.component';
import {MultiSelectComponent} from './components/multi-select/multi-select.component';
import {RingButtonComponent} from './components/ring-button/ring-button.component';
import {NavTabsComponent} from './components/nav-tabs/nav-tabs.component';
import {SliderComponent} from './components/slider/slider.component';
import {ParamTranslatePipe} from './pipes/param-translate.pipe';
import {SelectContainerComponent} from './components/select-container/select-container.component';

@NgModule({
  declarations: [
    CheckboxComponent,
    DialogComponent,
    FormFieldComponent,
    InputFieldComponent,
    NumberFieldComponent,
    SelectComponent,
    MultiSelectComponent,
    RingButtonComponent,
    NavTabsComponent,
    SliderComponent,
    ParamTranslatePipe,
    SelectContainerComponent,
  ],
  imports: [SharedModule],
  exports: [
    SharedModule,
    CheckboxComponent,
    DialogComponent,
    FormFieldComponent,
    InputFieldComponent,
    NumberFieldComponent,
    SelectComponent,
    MultiSelectComponent,
    RingButtonComponent,
    NavTabsComponent,
    SliderComponent,
    ParamTranslatePipe,
    SelectContainerComponent,
  ],
})
export class WidgetModule {}
