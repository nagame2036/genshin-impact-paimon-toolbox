import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {Observable, of, ReplaySubject, zip} from 'rxjs';
import {distinctUntilChanged, map, switchMap} from 'rxjs/operators';
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

  get<T>(id: string, defaultValue: () => T): Observable<T> {
    return this.settings.pipe(
      switchMap(settings => {
        const setting = settings.get(id);
        if (setting) {
          return of(setting);
        }
        const value = defaultValue();
        const update = this.database.update(this.storeName, {id, value});
        return update.pipe(
          map(_ => settings.set(id, value)),
          map(_ => value),
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
}
