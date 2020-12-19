import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

import {AscensionLevelSelectComponent} from './components/ascension-level-select/ascension-level-select.component';
import {ItemViewComponent} from './components/item-view/item-view.component';
import {MultiSelectComponent} from './components/multi-select/multi-select.component';
import {CurrentTargetSelectComponent} from './components/current-target-select/current-target-select.component';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {NgxIndexedDBModule} from 'ngx-indexed-db';
import {ExtendedModule, FlexModule} from '@angular/flex-layout';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [AscensionLevelSelectComponent, ItemViewComponent, MultiSelectComponent, CurrentTargetSelectComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxIndexedDBModule,
    MatFormFieldModule,
    MatSelectModule,
    FlexModule,
    MatCheckboxModule,
    MatIconModule,
    ExtendedModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxIndexedDBModule,
    AscensionLevelSelectComponent,
    ItemViewComponent,
    MultiSelectComponent,
    CurrentTargetSelectComponent
  ]
})
export class SharedModule {
}
