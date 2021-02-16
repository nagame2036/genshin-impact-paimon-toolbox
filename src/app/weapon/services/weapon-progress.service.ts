import {Injectable} from '@angular/core';
import {EMPTY, forkJoin, Observable, of, ReplaySubject, zip} from 'rxjs';
import {WeaponProgress} from '../models/weapon-progress.model';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {WeaponInfo} from '../models/weapon-info.model';
import {map, switchMap, throwIfEmpty} from 'rxjs/operators';
import {Weapon} from '../models/weapon.model';

@Injectable({
  providedIn: 'root'
})
export class WeaponProgressService {

  private readonly store = 'weapon-progresses';

  private readonly inProgress$ = new ReplaySubject<Map<number, WeaponProgress>>(1);

  readonly inProgress = this.inProgress$.asObservable();

  constructor(private database: NgxIndexedDBService, private logger: NGXLogger) {
    database.getAll(this.store).subscribe(progresses => {
      this.logger.info('fetched in-progress weapons from indexed db', progresses);
      const inProgress = new Map<number, WeaponProgress>();
      for (const progress of progresses) {
        inProgress.set(progress.id, progress);
      }
      this.inProgress$.next(inProgress);
    });
  }

  create(info: WeaponInfo, id: number): WeaponProgress {
    return {id, weaponId: info.id, refine: 1, ascension: 0, level: 1};
  }

  get(id: number): Observable<WeaponProgress> {
    return this.inProgress.pipe(
      switchMap(inProgress => {
        const progress = inProgress.get(id);
        return progress ? of(progress) : EMPTY;
      }),
      throwIfEmpty(),
    );
  }

  update({progress}: Weapon): Observable<void> {
    const update = this.database.update(this.store, progress);
    return zip(update, this.inProgress).pipe(map(([, inProgress]) => {
      this.logger.info('updated weapon progress', progress);
      inProgress.set(progress.id, progress);
      this.inProgress$.next(inProgress);
    }));
  }

  remove({progress}: Weapon): Observable<void> {
    const id = progress.id;
    const remove = this.database.delete(this.store, id);
    return zip(remove, this.inProgress).pipe(map(([, inProgress]) => {
      this.logger.info('removed weapon progress', progress);
      inProgress.delete(id);
      this.inProgress$.next(inProgress);
    }));
  }

  removeAll(weapons: Weapon[]): Observable<void> {
    const remove = weapons.map(it => this.database.delete(this.store, it.progress.id));
    return zip(forkJoin(remove), this.inProgress).pipe(map(([, inProgress]) => {
      this.logger.info('removed weapon progresses', weapons);
      weapons.forEach(it => inProgress.delete(it.progress.id));
      this.inProgress$.next(inProgress);
    }));
  }
}
