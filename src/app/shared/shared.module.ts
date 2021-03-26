import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {TranslateModule} from '@ngx-translate/core';
import {NgxIndexedDBModule} from 'ngx-indexed-db';
import {LoggerModule} from 'ngx-logger';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    NgxIndexedDBModule,
    LoggerModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    NgxIndexedDBModule,
    LoggerModule,
  ],
})
export class SharedModule {}
