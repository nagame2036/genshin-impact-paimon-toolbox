import {NgModule} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const translateConfig = {
  defaultLanguage: 'zh-CN',
  languages: [
    'zh-CN',
    'en'
  ],
  loader: {
    provide: TranslateLoader,
    useFactory: createTranslateLoader,
    deps: [HttpClient]
  }
};

@NgModule({
  imports: [HttpClientModule, TranslateModule.forRoot(translateConfig)],
  exports: [TranslateModule]
})
export class AppTranslateModule {
}
