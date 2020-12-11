import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

import {AscensionLevelSelectComponent} from './ascension-level-select/ascension-level-select.component';
import {ItemImageContainerComponent} from './item-image-container/item-image-container.component';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {NgxIndexedDBModule} from 'ngx-indexed-db';

@NgModule({
  declarations: [AscensionLevelSelectComponent, ItemImageContainerComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxIndexedDBModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxIndexedDBModule,
    AscensionLevelSelectComponent,
    ItemImageContainerComponent
  ]
})
export class SharedModule {
}
