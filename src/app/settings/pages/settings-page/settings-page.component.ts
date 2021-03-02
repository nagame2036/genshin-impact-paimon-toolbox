import {Component, OnInit} from '@angular/core';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {supportedLanguages} from '../../../app-translate.module';
import {I18n} from '../../../widget/models/i18n.model';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent implements OnInit {
  i18n = new I18n('settings');

  currentLanguage = '';

  languages = supportedLanguages;

  constructor(private translator: TranslateService, private logger: NGXLogger) {
    this.currentLanguage = translator.currentLang;
    translator.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLanguage = event.lang;
    });
  }

  ngOnInit(): void {}

  switchLanguage(language: string): void {
    this.currentLanguage = language;
    this.logger.info('switch language', language);
    this.translator.use(language);
  }
}
