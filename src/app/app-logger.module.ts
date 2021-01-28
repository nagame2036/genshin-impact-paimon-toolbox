import {isDevMode, NgModule} from '@angular/core';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';

const logLevel = isDevMode() ? NgxLoggerLevel.DEBUG : NgxLoggerLevel.WARN;

@NgModule({
  declarations: [],
  imports: [
    LoggerModule.forRoot({
      level: logLevel,
      enableSourceMaps: true,
    }),
  ],
  exports: [
    LoggerModule,
  ]
})
export class AppLoggerModule {
}
