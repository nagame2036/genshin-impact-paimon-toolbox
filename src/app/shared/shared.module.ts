import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

import {AscensionLevelSelectComponent} from './components/ascension-level-select/ascension-level-select.component';
import {ItemViewComponent} from './components/item-view/item-view.component';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {NgxIndexedDBModule} from 'ngx-indexed-db';
import {FlexModule} from '@angular/flex-layout';
import {MultiSelectComponent} from './components/multi-select/multi-select.component';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [AscensionLevelSelectComponent, ItemViewComponent, MultiSelectComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxIndexedDBModule,
    MatFormFieldModule,
    MatSelectModule,
    FlexModule,
    MatCheckboxModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxIndexedDBModule,
    AscensionLevelSelectComponent,
    ItemViewComponent,
    MultiSelectComponent
  ]
})
export class SharedModule {
}
