import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {EMPTY, forkJoin, Observable, of, ReplaySubject, zip} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {map, switchMap, throwIfEmpty} from 'rxjs/operators';
import {CharacterInfo} from '../models/character-info.model';
import {CharacterProgress} from '../models/character-progress.model';
import {TalentProgress} from '../models/talent-progress.model';
import {Character} from '../models/character.model';
import {CharacterInfoService} from './character-info.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterProgressService {

  private readonly store = 'character-progresses';

  private readonly inProgress$ = new ReplaySubject<Map<number, CharacterProgress>>(1);

  readonly inProgress = this.inProgress$.asObservable();

  private readonly noProgress$ = new ReplaySubject<Map<number, CharacterInfo>>(1);

  readonly noProgress = this.noProgress$.asObservable();

  constructor(private database: NgxIndexedDBService, private information: CharacterInfoService, private logger: NGXLogger) {
    zip(database.getAll(this.store), information.infos).subscribe(([progresses, infos]) => {
      this.logger.info('fetched in-progress characters from indexed db', progresses);
      const inProgress = new Map<number, CharacterProgress>();
      const noProgress = new Map<number, CharacterInfo>(infos);
      for (const progress of progresses) {
        inProgress.set(progress.id, progress);
        noProgress.delete(progress.id);
      }
      this.inProgress$.next(inProgress);
      this.noProgress$.next(noProgress);
    });
  }

  create(info: CharacterInfo, id: number): CharacterProgress {
    const talents: TalentProgress = {};
    info.talentsUpgradable.forEach(t => talents[t] = 1);
    return {id, constellation: 0, ascension: 0, level: 1, talents};
  }

  get(id: number): Observable<CharacterProgress> {
    return this.inProgress.pipe(
      switchMap(inProgress => {
        const progress = inProgress.get(id);
        return progress ? of(progress) : EMPTY;
      }),
      throwIfEmpty(),
    );
  }

  update({progress}: Character): Observable<void> {
    const update = this.database.update(this.store, progress);
    return zip(update, this.inProgress, this.noProgress).pipe(map(([, inProgress, noProgress]) => {
      this.logger.info('updated character progress', progress);
      inProgress.set(progress.id, progress);
      noProgress.delete(progress.id);
      this.inProgress$.next(inProgress);
      this.noProgress$.next(noProgress);
    }));
  }

  remove({info, progress}: Character): Observable<void> {
    const {id} = progress;
    const remove = this.database.delete(this.store, id);
    return zip(remove, this.inProgress, this.noProgress).pipe(map(([, inProgress, noProgress]) => {
      this.logger.info('removed character progress', progress);
      inProgress.delete(id);
      noProgress.set(info.id, info);
      this.inProgress$.next(inProgress);
      this.noProgress$.next(noProgress);
    }));
  }

  removeAll(characters: Character[]): Observable<void> {
    const remove = characters.map(it => this.database.delete(this.store, it.progress.id));
    return zip(forkJoin(remove), this.inProgress, this.noProgress).pipe(map(([, inProgress, noProgress]) => {
      this.logger.info('removed character progresses', characters);
      for (const {info, progress} of characters) {
        inProgress.delete(progress.id);
        noProgress.set(info.id, info);
      }
      this.inProgress$.next(inProgress);
      this.noProgress$.next(noProgress);
    }));
  }
}
