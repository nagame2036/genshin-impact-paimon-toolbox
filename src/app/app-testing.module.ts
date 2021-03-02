import {NgModule} from '@angular/core';
import {AppTranslateModule} from './app-translate.module';
import {AppIndexedDbModule} from './app-indexed-db.module';
import {AppLoggerModule} from './app-logger.module';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from './shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    RouterTestingModule,
    HttpClientModule,
    AppTranslateModule,
    AppIndexedDbModule,
    AppLoggerModule,
  ],
  exports: [
    SharedModule,
    RouterTestingModule,
    HttpClientModule,
    AppTranslateModule,
    AppIndexedDbModule,
    AppLoggerModule,
  ],
})
export class AppTestingModule {}
