import {NgModule} from '@angular/core';
import {LoggerModule} from 'ngx-logger';
import {environment} from '../environments/environment';

@NgModule({
  declarations: [],
  imports: [
    LoggerModule.forRoot({
      level: environment.logLevel,
      enableSourceMaps: true,
    }),
  ],
  exports: [
    LoggerModule,
  ]
})
export class AppLoggerModule {
}
