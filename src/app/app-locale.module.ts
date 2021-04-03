import {NgModule} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {MultiTranslateHttpLoader} from 'ngx-translate-multi-http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';

export const localeSettingKey = 'locale';

const supportedLocales = [
  {value: 'zh-hans', text: '简体中文'},
  {value: 'en', text: 'English'},
] as const;

export type Locale = typeof supportedLocales[number]['value'];

export const allLocales = [...supportedLocales];

function createTranslateLoader(http: HttpClient): MultiTranslateHttpLoader {
  return new MultiTranslateHttpLoader(http, [
    {prefix: './assets/i18n/core/', suffix: '.json'},
    {prefix: './assets/i18n/data/', suffix: '.json'},
  ]);
}

const config = {
  defaultLanguage: allLocales[0].value,
  languages: allLocales.map(it => it.value),
  loader: {
    provide: TranslateLoader,
    useFactory: createTranslateLoader,
    deps: [HttpClient],
  },
};

export const defaultLocale = config.defaultLanguage;

@NgModule({
  imports: [HttpClientModule, TranslateModule.forRoot(config)],
  exports: [TranslateModule],
})
export class AppLocaleModule {}
