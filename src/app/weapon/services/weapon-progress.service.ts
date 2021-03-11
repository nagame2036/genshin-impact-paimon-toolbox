import {Injectable} from '@angular/core';
import {forkJoin, Observable, ReplaySubject} from 'rxjs';
import {WeaponProgress} from '../models/weapon-progress.model';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {WeaponInfo} from '../models/weapon-info.model';
import {map} from 'rxjs/operators';
import {Weapon} from '../models/weapon.model';

@Injectable({
  providedIn: 'root',
})
export class WeaponProgressService {
  private readonly store = 'weapon-progresses';

  readonly inProgress = new Map<number, WeaponProgress>();

  readonly ready = new ReplaySubject(1);

  constructor(
    private database: NgxIndexedDBService,
    private logger: NGXLogger,
  ) {
    database.getAll(this.store).subscribe(progresses => {
      this.logger.info('fetched in-progress weapons', progresses);
      for (const progress of progresses) {
        this.inProgress.set(progress.id, progress);
      }
      this.ready.next();
      this.ready.complete();
    });
  }

  create(info: WeaponInfo, id: number): WeaponProgress {
    return {id, weaponId: info.id, refine: 1, ascension: 0, level: 1};
  }

  update({progress}: Weapon): Observable<void> {
    return this.database.update(this.store, progress).pipe(
      map(_ => {
        this.logger.info('updated weapon progress', progress);
        this.inProgress.set(progress.id, progress);
      }),
    );
  }

  remove({progress}: Weapon): Observable<void> {
    const id = progress.id;
    return this.database.delete(this.store, id).pipe(
      map(_ => {
        this.logger.info('removed weapon progress', progress);
        this.inProgress.delete(id);
      }),
    );
  }

  removeAll(weapons: Weapon[]): Observable<void> {
    const remove = weapons.map(it =>
      this.database.delete(this.store, it.progress.id),
    );
    return forkJoin(remove).pipe(
      map(_ => {
        this.logger.info('removed weapon progresses', weapons);
        weapons.forEach(it => this.inProgress.delete(it.progress.id));
      }),
    );
  }
}
