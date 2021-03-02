import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {supportedLanguages} from '../../../app-translate.module';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  i18n = new I18n('core');

  @Output()
  showMenu = new EventEmitter<boolean>();

  languages = supportedLanguages;

  currentLanguage = '';

  constructor(public translator: TranslateService, private logger: NGXLogger) {
    this.switchLanguage(translator.defaultLang);
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
