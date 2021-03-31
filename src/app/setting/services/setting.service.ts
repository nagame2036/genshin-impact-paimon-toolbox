import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {Observable, of, ReplaySubject, zip} from 'rxjs';
import {distinctUntilChanged, first, map, switchMap} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  private readonly storeName = 'settings';

  private readonly settings = new ReplaySubject<Map<string, any>>(1);

  constructor(
    private database: NgxIndexedDBService,
    private translator: TranslateService,
    private logger: NGXLogger,
  ) {
    database.getAll(this.storeName).subscribe(data => {
      const settings = new Map<string, any>();
      const properties = ['id', 'value'];
      for (const datum of data) {
        if (properties.every(it => datum.hasOwnProperty(it))) {
          settings.set(String(datum.id), datum.value);
        }
      }
      this.logger.info('fetched settings', settings);
      this.settings.next(settings);
    });
  }

  get<T>(id: string, defaultValue: T): Observable<T> {
    return this.settings.pipe(
      switchMap(settings => {
        const setting = settings.get(id);
        if (setting && optionHasValue(setting, defaultValue)) {
          return of(setting);
        }
        const value = defaultValue;
        return this.database.update(this.storeName, {id, value}).pipe(
          map(_ => {
            settings.set(id, value);
            return value;
          }),
        );
      }),
      distinctUntilChanged(),
    );
  }

  set(id: string, value: any): void {
    const update = this.database.update(this.storeName, {id, value});
    zip(update, this.settings).subscribe(([, settings]) => {
      settings.set(id, value);
      this.logger.info('update settings', id, value);
      this.settings.next(settings);
    });
  }

  update(id: string, value: any): void {
    this.settings.pipe(
      first(),
      map(settings => {
        const curr = settings.get(id) ?? {};
        return this.set(id, {...curr, ...value});
      }),
    );
  }
}

function optionHasValue<T>(setting: any, defaultValue: T): boolean {
  return (
    typeof defaultValue === 'string' ||
    defaultValue instanceof Array ||
    Object.keys(defaultValue).every(it => setting.hasOwnProperty(it))
  );
}
