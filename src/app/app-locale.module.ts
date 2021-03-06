import {NgModule} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {MultiTranslateHttpLoader} from 'ngx-translate-multi-http-loader';
import {TranslateLoader, TranslateModule, TranslateModuleConfig} from '@ngx-translate/core';

export const localeSettingKey = 'locale';

const supportedLocales = [
  {value: 'zh-hans', text: '简体中文'},
  {value: 'en', text: 'English'},
] as const;

export type Locale = typeof supportedLocales[number]['value'];

export const allLocales = [...supportedLocales];

function createTranslateLoader(http: HttpClient): MultiTranslateHttpLoader {
  const dirs = ['dict', 'modules', 'data', 'data-extracted'];
  const resources = dirs.map(it => ({prefix: `./assets/i18n/${it}/`, suffix: '.json'}));
  return new MultiTranslateHttpLoader(http, resources);
}

export const defaultLocale: Locale = allLocales[0].value;

const config: TranslateModuleConfig = {
  defaultLanguage: defaultLocale,
  loader: {
    provide: TranslateLoader,
    useFactory: createTranslateLoader,
    deps: [HttpClient],
  },
};

@NgModule({
  imports: [HttpClientModule, TranslateModule.forRoot(config)],
  exports: [TranslateModule],
})
export class AppLocaleModule {}
