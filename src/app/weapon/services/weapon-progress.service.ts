import {Injectable} from '@angular/core';
import {EMPTY, forkJoin, Observable, of, ReplaySubject, zip} from 'rxjs';
import {WeaponProgress} from '../models/weapon-progress.model';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {WeaponInfo} from '../models/weapon-info.model';
import {switchMap, throwIfEmpty} from 'rxjs/operators';
import {Weapon} from '../models/weapon.model';
import {WeaponInfoService} from './weapon-info.service';

@Injectable({
  providedIn: 'root'
})
export class WeaponProgressService {

  private readonly store = 'weapon-progresses';

  private readonly inProgress$ = new ReplaySubject<Map<number, WeaponProgress>>(1);

  readonly inProgress = this.inProgress$.asObservable();

  private readonly noProgress$ = new ReplaySubject<Map<number, WeaponInfo>>(1);

  readonly noProgress = this.noProgress$.asObservable();

  constructor(private database: NgxIndexedDBService, private information: WeaponInfoService, private logger: NGXLogger) {
    zip(database.getAll(this.store), information.items).subscribe(([progresses, infos]) => {
      this.logger.info('fetched in-progress weapons from indexed db', progresses);
      const inProgress = new Map<number, WeaponProgress>();
      const noProgress = new Map<number, WeaponInfo>(infos);
      for (const progress of progresses) {
        inProgress.set(progress.id, progress);
        noProgress.delete(progress.weaponId);
      }
      this.inProgress$.next(inProgress);
      this.noProgress$.next(noProgress);
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

  update({progress}: Weapon): void {
    const update = this.database.update(this.store, progress);
    zip(update, this.inProgress).subscribe(([, inProgress]) => {
      this.logger.info('updated weapon progress', progress);
      inProgress.set(progress.id, progress);
      this.inProgress$.next(inProgress);
    });
  }

  remove({info, progress}: Weapon): void {
    const id = progress.id;
    const remove = this.database.delete(this.store, id);
    zip(remove, this.inProgress, this.noProgress).subscribe(([, inProgress, noProgress]) => {
      this.logger.info('removed weapon progress', progress);
      inProgress.delete(id);
      this.inProgress$.next(inProgress);
      noProgress.set(info.id, info);
      this.noProgress$.next(noProgress);
    });
  }

  removeAll(weapons: Weapon[]): void {
    const remove = weapons.map(it => this.database.delete(this.store, it.progress.id));
    zip(forkJoin(remove), this.inProgress, this.noProgress).subscribe(([, inProgress, noProgress]) => {
      this.logger.info('removed weapon progresses', weapons);
      for (const {info, progress} of weapons) {
        inProgress.delete(progress.id);
        noProgress.set(info.id, info);
      }
      this.inProgress$.next(inProgress);
      this.noProgress$.next(noProgress);
    });
  }
}
