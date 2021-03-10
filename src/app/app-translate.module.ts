import {NgModule} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {MultiTranslateHttpLoader} from 'ngx-translate-multi-http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';

export const languageSettingKey = 'app-language';

export const supportedLanguages = [
  {value: 'zh-hans', text: '简体中文'},
  {value: 'en', text: 'English'},
];

export function createTranslateLoader(
  http: HttpClient,
): MultiTranslateHttpLoader {
  return new MultiTranslateHttpLoader(http, [
    {prefix: './assets/i18n/core/', suffix: '.json'},
    {prefix: './assets/i18n/data/', suffix: '.json'},
  ]);
}

const translateConfig = {
  defaultLanguage: supportedLanguages[0].value,
  languages: supportedLanguages.map(it => it.value),
  loader: {
    provide: TranslateLoader,
    useFactory: createTranslateLoader,
    deps: [HttpClient],
  },
};

@NgModule({
  imports: [HttpClientModule, TranslateModule.forRoot(translateConfig)],
  exports: [TranslateModule],
})
export class AppTranslateModule {}
