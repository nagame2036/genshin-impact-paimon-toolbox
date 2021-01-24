import {Component, OnInit} from '@angular/core';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {supportedLanguages} from '../../../app-translate.module';
import {I18n} from '../../../shared/models/i18n.model';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {

  i18n = new I18n('settings');

  currentLanguage = '';

  languages = supportedLanguages;

  constructor(private translator: TranslateService) {
    this.currentLanguage = translator.currentLang;
    translator.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLanguage = event.lang;
    });
  }

  ngOnInit(): void {
  }

  switchLanguage(language: string): void {
    this.currentLanguage = language;
    this.translator.use(language);
  }
}
