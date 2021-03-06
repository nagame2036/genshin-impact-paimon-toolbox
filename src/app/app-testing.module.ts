import {NgModule} from '@angular/core';
import {AppLocaleModule} from './app-locale.module';
import {AppIndexedDbModule} from './app-indexed-db.module';
import {AppLoggerModule} from './app-logger.module';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from './shared/shared.module';

const imports = [
  SharedModule,
  RouterTestingModule,
  HttpClientModule,
  AppLocaleModule,
  AppIndexedDbModule,
  AppLoggerModule,
];

@NgModule({
  imports,
  exports: imports,
})
export class AppTestingModule {}
