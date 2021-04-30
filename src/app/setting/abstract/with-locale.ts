import {WithOnDestroy} from '../../shared/abstract/on-destroy';
import {SettingService} from '../services/setting.service';
import {Locale} from '../../app-locale.module';

/**
 * Mixin for components and services with onLocaleChange hook.
 * @param Base the target class
 */
export abstract class WithLocale extends WithOnDestroy {
  protected constructor(protected settings: SettingService) {
    super();
  }

  listenLocaleChange(): void {
    this.onLocaleChange(this.settings.defaultLocale);
    this.settings.locale.pipe(this.untilDestroy()).subscribe(locale => this.onLocaleChange(locale));
  }

  protected abstract onLocaleChange(locale: Locale): void;
}
