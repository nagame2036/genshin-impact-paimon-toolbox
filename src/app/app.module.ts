import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from './core/core.module';
import {AppLocaleModule} from './app-locale.module';
import {AppIndexedDbModule} from './app-indexed-db.module';
import {AppLoggerModule} from './app-logger.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppLocaleModule,
    AppIndexedDbModule,
    AppLoggerModule,
    CoreModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
