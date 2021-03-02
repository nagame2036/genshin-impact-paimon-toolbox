import {Injectable} from '@angular/core';
import {EMPTY, forkJoin, Observable, of, ReplaySubject, zip} from 'rxjs';
import {Character, CharacterOverview} from '../models/character.model';
import {CharacterInfo} from '../models/character-info.model';
import {
  defaultIfEmpty,
  first,
  map,
  mergeMap,
  switchMap,
  tap,
  throwIfEmpty,
} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';
import {CharacterInfoService} from './character-info.service';
import {CharacterProgressService} from './character-progress.service';
import {CharacterPlanner} from './character-planner.service';
import {RequireDetail} from '../../material/models/requirement-detail.model';
import {MaterialService} from '../../material/services/material.service';
import {StatsType} from '../../game-common/models/stats.model';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private readonly characters$ = new ReplaySubject<Map<number, Character>>(1);

  readonly characters = this.characters$.asObservable();

  readonly nonParty = this.progressor.noProgress.pipe(
    map(infos => [...infos.values()]),
  );

  readonly statsTypeCache = new Map<number, StatsType[]>();

  constructor(
    private information: CharacterInfoService,
    private progressor: CharacterProgressService,
    private planner: CharacterPlanner,
    private materials: MaterialService,
    private logger: NGXLogger,
  ) {
    zip(this.information.infos, this.progressor.inProgress, this.planner.plans)
      .pipe(
        first(),
        map(([infos, inProgress, plans]) => {
          const characters = new Map<number, Character>();
          for (const [id, progress] of inProgress) {
            const [info, plan] = [infos.get(id), plans.get(id)];
            if (info && plan) {
              characters.set(id, {info, progress, plan});
            }
          }
          this.logger.info('loaded characters', characters);
          this.characters$.next(characters);
          return characters;
        }),
        switchMap(characters => {
          const requirementObs = [...characters.values()].map(character => {
            return this.planner.updateRequire(character);
          });
          return forkJoin(requirementObs);
        }),
      )
      .subscribe(_ => {
        this.logger.info('loaded the requirements of all characters');
      });
  }

  create(info: CharacterInfo): Observable<CharacterOverview> {
    const id = info.id;
    const progress = this.progressor.create(info, id);
    const plan = this.planner.create(info, id);
    const character = {info, progress, plan};
    return this.information.getOverview(character);
  }

  get(id: number): Observable<Character> {
    return this.characters.pipe(
      switchMap(characters => {
        const character = characters.get(id);
        return character ? of(character) : EMPTY;
      }),
      throwIfEmpty(),
      tap(character => this.logger.info('sent character', character)),
    );
  }

  getRequireDetails(character: Character): Observable<RequireDetail[]> {
    return this.planner.getRequireDetails(character);
  }

  getOverview(character: Character): Observable<CharacterOverview> {
    return this.information.getOverview(character);
  }

  getStatsTypes(character: CharacterOverview): StatsType[] {
    const id = character.info.id;
    const existing = this.statsTypeCache.get(id);
    if (existing) {
      return existing;
    }
    const result = character.currentStats.getTypes();
    this.statsTypeCache.set(id, result);
    return result;
  }

  getAll(): Observable<CharacterOverview[]> {
    return this.characters.pipe(
      switchMap(characters =>
        forkJoin([...characters.values()].map(it => this.getOverview(it))),
      ),
      defaultIfEmpty([] as CharacterOverview[]),
      tap(characters => this.logger.info('sent characters', characters)),
    );
  }

  update(character: Character): void {
    this.characters
      .pipe(
        first(),
        map(characters => {
          characters.set(character.progress.id, character);
          this.characters$.next(characters);
        }),
        mergeMap(_ => this.progressor.update(character)),
        mergeMap(_ => this.planner.update(character)),
      )
      .subscribe(_ => {
        this.logger.info('updated character', character);
      });
  }

  remove(character: Character): void {
    this.characters
      .pipe(
        first(),
        map(characters => {
          characters.delete(character.progress.id);
          this.characters$.next(characters);
        }),
        mergeMap(_ => this.progressor.remove(character)),
        mergeMap(_ => this.planner.remove(character)),
      )
      .subscribe(_ => this.logger.info('removed character', character));
  }

  removeAll(characterList: Character[]): void {
    this.characters
      .pipe(
        first(),
        map(characters => {
          characterList.forEach(character =>
            characters.delete(character.progress.id),
          );
          this.characters$.next(characters);
        }),
        mergeMap(_ => this.progressor.removeAll(characterList)),
        mergeMap(_ => this.planner.removeAll(characterList)),
      )
      .subscribe(_ => this.logger.info('removed characters', characterList));
  }
}
