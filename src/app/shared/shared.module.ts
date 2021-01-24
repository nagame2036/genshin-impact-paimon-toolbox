import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {TranslateModule} from '@ngx-translate/core';
import {NgxIndexedDBModule} from 'ngx-indexed-db';

@NgModule({
  declarations: [
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
  ]
})
export class SharedModule {
}
