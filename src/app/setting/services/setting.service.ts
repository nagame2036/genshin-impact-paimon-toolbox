import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {Observable, of, ReplaySubject, zip} from 'rxjs';
import {distinctUntilChanged, first, mapTo, switchMap, tap} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {allLocales, defaultLocale, Locale, localeSettingKey} from '../../app-locale.module';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  readonly storeName = 'settings';

  readonly settings = new ReplaySubject<Map<string, any>>(1);

  allLocales = allLocales;

  defaultLocale = defaultLocale;

  locale = new ReplaySubject<Locale>(1);

  private defaultValues = new Map<string, any>();

  constructor(
    private database: NgxIndexedDBService,
    private translator: TranslateService,
    private logger: NGXLogger,
  ) {
    database.getAll(this.storeName).subscribe(data => {
      const settings = new Map<string, any>();
      for (const datum of data) {
        if (['id', 'value'].every(it => datum.hasOwnProperty(it))) {
          settings.set(String(datum.id), datum.value);
        }
      }
      this.logger.info('fetched settings', settings);
      this.settings.next(settings);
    });
    this.get(localeSettingKey, this.defaultLocale)
      .pipe(switchMap(locale => translator.use(locale).pipe(mapTo(locale))))
      .subscribe(locale => this.locale.next(locale));
  }

  get<T>(id: string, defaultValue?: T): Observable<T> {
    return this.settings.pipe(
      switchMap(settings => {
        const setting = settings.get(id);
        if (defaultValue && !this.defaultValues.has(id)) {
          this.defaultValues.set(id, defaultValue);
        }
        const value = this.defaultValues.get(id) ?? {};
        return setting && optionHasValue(setting, value)
          ? of(setting)
          : this.database.update(this.storeName, {id, value}).pipe(
              tap(_ => settings.set(id, value)),
              mapTo(value),
            );
      }),
      distinctUntilChanged(),
    );
  }

  set(id: string, value: any): void {
    const update = this.database.update(this.storeName, {id, value});
    zip(this.settings, update).subscribe(([settings]) => {
      settings.set(id, value);
      this.logger.info('set setting', id, value);
      this.settings.next(settings);
    });
  }

  update(id: string, value: any): void {
    this.settings.pipe(first()).subscribe(settings => {
      const curr = settings.get(id) ?? {};
      this.set(id, {...curr, ...value});
    });
  }

  useLocale(value: Locale): void {
    this.set(localeSettingKey, value);
  }
}

function optionHasValue<T>(setting: any, defaultValue: T): boolean {
  return (
    typeof defaultValue === 'string' ||
    defaultValue instanceof Array ||
    Object.keys(defaultValue).every(it => setting.hasOwnProperty(it))
  );
}
