import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {I18n} from '../../../shared/models/i18n.model';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {supportedLanguages} from '../../../app-translate.module';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  i18n = new I18n('core');

  @Output()
  showMenu = new EventEmitter<boolean>();

  languages = supportedLanguages;

  currentLanguage = '';

  constructor(public translator: TranslateService) {
    this.switchLanguage(translator.defaultLang);
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
