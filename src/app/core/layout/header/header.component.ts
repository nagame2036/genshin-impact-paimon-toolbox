import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {TranslateService} from '@ngx-translate/core';
import {
  languageSettingKey,
  supportedLanguages,
} from '../../../app-translate.module';
import {SettingService} from '../../../setting/services/setting.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  i18n = I18n.create('core');

  @Output()
  showMenu = new EventEmitter<boolean>();

  languages = supportedLanguages;

  currentLanguage = '';

  constructor(
    private settings: SettingService,
    private translator: TranslateService,
  ) {
    settings
      .get(languageSettingKey, supportedLanguages[0].value)
      .subscribe(lang => {
        this.currentLanguage = lang;
        translator.use(lang);
      });
  }

  ngOnInit(): void {}

  switchLanguage(language: string): void {
    this.settings.set(languageSettingKey, language);
  }
}
