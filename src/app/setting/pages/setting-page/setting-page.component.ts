import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {
  defaultLanguage,
  languageSettingKey,
  supportedLanguages,
} from '../../../app-translate.module';
import {I18n} from '../../../widget/models/i18n.model';
import {SettingService} from '../../services/setting.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './setting-page.component.html',
  styleUrls: ['./setting-page.component.scss'],
})
export class SettingPageComponent implements OnInit {
  i18n = I18n.create('settings');

  languages = supportedLanguages;

  currentLanguage = '';

  constructor(
    private translator: TranslateService,
    private settings: SettingService,
  ) {
    settings.get(languageSettingKey, defaultLanguage).subscribe(lang => {
      this.currentLanguage = lang;
      translator.use(lang);
    });
  }

  ngOnInit(): void {}

  switchLanguage(language: string): void {
    this.settings.set(languageSettingKey, language);
  }
}
