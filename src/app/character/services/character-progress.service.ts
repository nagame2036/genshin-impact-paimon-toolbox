import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {forkJoin, Observable, ReplaySubject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {map} from 'rxjs/operators';
import {CharacterInfo} from '../models/character-info.model';
import {CharacterProgress} from '../models/character-progress.model';
import {TalentProgress} from '../models/talent-progress.model';
import {Character} from '../models/character.model';
import {CharacterInfoService} from './character-info.service';

@Injectable({
  providedIn: 'root',
})
export class CharacterProgressService {
  private readonly store = 'character-progresses';

  readonly inProgress = new Map<number, CharacterProgress>();

  readonly noProgress = new Map<number, CharacterInfo>(this.information.infos);

  readonly ready = new ReplaySubject(1);

  constructor(
    private database: NgxIndexedDBService,
    private information: CharacterInfoService,
    private logger: NGXLogger,
  ) {
    database.getAll(this.store).subscribe(progresses => {
      this.logger.info('fetched in-progress characters', progresses);
      for (const progress of progresses) {
        this.inProgress.set(progress.id, progress);
        this.noProgress.delete(progress.id);
      }
      this.ready.next();
      this.ready.complete();
    });
  }

  create(info: CharacterInfo, id: number): CharacterProgress {
    const talents: TalentProgress = {};
    info.talentsUpgradable.forEach(t => (talents[t] = 1));
    return {id, constellation: 0, ascension: 0, level: 1, talents};
  }

  update({progress}: Character): Observable<void> {
    return this.database.update(this.store, progress).pipe(
      map(_ => {
        this.logger.info('updated character progress', progress);
        this.inProgress.set(progress.id, progress);
        this.noProgress.delete(progress.id);
      }),
    );
  }

  removeAll(list: Character[]): Observable<void> {
    const remove = list.map(it =>
      this.database.delete(this.store, it.progress.id),
    );
    return forkJoin(remove).pipe(
      map(_ => {
        this.logger.info('removed character progresses', list);
        for (const {info, progress} of list) {
          this.inProgress.delete(progress.id);
          this.noProgress.set(info.id, info);
        }
      }),
    );
  }
}
