import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {TranslateModule} from '@ngx-translate/core';
import {NgxIndexedDBModule} from 'ngx-indexed-db';
import {LoggerModule} from 'ngx-logger';

const imports = [CommonModule, RouterModule, TranslateModule, NgxIndexedDBModule, LoggerModule];

@NgModule({
  imports,
  exports: imports,
})
export class SharedModule {}
