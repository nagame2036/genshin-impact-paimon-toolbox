import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {allLocales, localeSettingKey} from '../../../app-locale.module';
import {SettingService} from '../../../setting/services/setting.service';
import {AbstractObservableDirective} from '../../../shared/directives/abstract-observable.directive';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent
  extends AbstractObservableDirective
  implements OnInit {
  i18n = I18n.create('core');

  @Output()
  showMenu = new EventEmitter<boolean>();

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
