import {Component, OnInit} from '@angular/core';
import {allLocales, localeSettingKey} from '../../../app-locale.module';
import {I18n} from '../../../widget/models/i18n.model';
import {SettingService} from '../../services/setting.service';
import {takeUntil} from 'rxjs/operators';
import {AbstractObservableDirective} from '../../../shared/directives/abstract-observable.directive';

@Component({
  selector: 'app-settings-page',
  templateUrl: './setting-page.component.html',
  styleUrls: ['./setting-page.component.scss'],
})
export class SettingPageComponent
  extends AbstractObservableDirective
  implements OnInit {
  i18n = I18n.create('settings');

  languages = allLocales;

  currentLanguage = '';

  constructor(private settings: SettingService) {
    super();
    settings.locale
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => (this.currentLanguage = lang));
  }

  ngOnInit(): void {}

  switchLanguage(language: string): void {
    this.settings.set(localeSettingKey, language);
  }
}
