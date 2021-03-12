import {Injectable} from '@angular/core';
import {forkJoin, Observable, of, ReplaySubject, throwError, zip} from 'rxjs';
import {Character, CharacterOverview} from '../models/character.model';
import {CharacterInfo} from '../models/character-info.model';
import {map, switchMap, tap} from 'rxjs/operators';
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
  private characters = new Map<number, Character>();

  private nonParty = [...this.progressor.noProgress.values()];

  private statsTypeCache = new Map<number, StatsType[]>();

  private updated = new ReplaySubject(1);

  constructor(
    private information: CharacterInfoService,
    private progressor: CharacterProgressService,
    private planner: CharacterPlanner,
    private materials: MaterialService,
    private logger: NGXLogger,
  ) {
    zip(progressor.ready, planner.ready).subscribe(_ => {
      const characters = this.characters;
      const infos = information.infos;
      const inProgress = progressor.inProgress;
      const plans = planner.plans;
      for (const [id, progress] of inProgress) {
        const [info, plan] = [infos.get(id), plans.get(id)];
        if (info && plan) {
          characters.set(id, {info, progress, plan});
        }
      }
      this.logger.info('loaded characters', characters);
      characters.forEach(character => this.planner.updateRequire(character));
      this.logger.info('loaded the requirements of all characters');
      this.updated.next();
    });
  }

  create(info: CharacterInfo): CharacterOverview {
    const id = info.id;
    const progress = this.progressor.create(info, id);
    const plan = this.planner.create(info, id);
    const character = {info, progress, plan};
    return this.getOverview(character);
  }

  get(id: number): Observable<Character> {
    return this.updated.pipe(
      switchMap(_ => {
        const character = this.characters.get(id);
        this.logger.info('sent character', character);
        return character ? of(character) : throwError('character-not-found');
      }),
    );
  }

  getRequireDetails(character: Character): Observable<RequireDetail[]> {
    return this.planner.getRequireDetails(character);
  }

  getOverview(character: Character): CharacterOverview {
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
    return this.updated.pipe(
      map(_ => [...this.characters.values()].map(it => this.getOverview(it))),
      tap(list => this.logger.info('sent characters', list)),
    );
  }

  getAllNonParty(): Observable<CharacterInfo[]> {
    return this.updated.pipe(
      map(_ => [...this.nonParty.values()]),
      tap(list => this.logger.info('sent non-party characters', list)),
    );
  }

  update(character: Character): void {
    this.characters.set(character.progress.id, character);
    const subActions = [
      this.progressor.update(character),
      this.planner.update(character),
    ];
    forkJoin(subActions).subscribe(_ => {
      this.logger.info('updated character', character);
      this.updated.next();
    });
  }

  remove(character: Character): void {
    this.characters.delete(character.progress.id);
    const subActions = [
      this.progressor.remove(character),
      this.planner.remove(character),
    ];
    forkJoin(subActions).subscribe(_ => {
      this.logger.info('removed character', character);
      this.updated.next();
    });
  }

  removeAll(list: Character[]): void {
    list.forEach(character => this.characters.delete(character.progress.id));
    const subActions = [
      this.progressor.removeAll(list),
      this.planner.removeAll(list),
    ];
    forkJoin(subActions).subscribe(_ => {
      this.logger.info('removed characters', list);
      this.updated.next();
    });
  }
}
