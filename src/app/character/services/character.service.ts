import {Injectable} from '@angular/core';
import {
  combineLatest,
  forkJoin,
  Observable,
  of,
  ReplaySubject,
  throwError,
  zip,
} from 'rxjs';
import {Character, CharacterOverview} from '../models/character.model';
import {CharacterInfo} from '../models/character-info.model';
import {map, switchMap} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';
import {CharacterInfoService} from './character-info.service';
import {CharacterProgressService} from './character-progress.service';
import {CharacterPlanner} from './character-planner.service';
import {RequireDetail} from '../../material/models/requirement-detail.model';
import {MaterialService} from '../../material/services/material.service';
import {StatsType} from '../../game-common/models/stats.model';
import {TalentInfoService} from './talent-info.service';
import {Ascension} from '../../game-common/models/ascension.type';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private characters = new Map<number, Character>();

  private statsTypeCache = new Map<number, StatsType[]>();

  private updated = new ReplaySubject(1);

  constructor(
    private information: CharacterInfoService,
    private progressor: CharacterProgressService,
    private planner: CharacterPlanner,
    private talents: TalentInfoService,
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
    return combineLatest([this.updated, this.information.ignoredIds()]).pipe(
      map(([, ids]) => {
        const list = [...this.characters.values()]
          .filter(it => !ids.includes(it.info.id))
          .map(it => this.getOverview(it));
        this.logger.info('sent characters', list);
        return list;
      }),
    );
  }

  getAllNonParty(): Observable<CharacterInfo[]> {
    return combineLatest([this.updated, this.information.ignoredIds()]).pipe(
      map(([, ids]) => {
        const nonParty = [...this.progressor.noProgress.values()];
        const list = nonParty.filter(it => !ids.includes(it.id));
        this.logger.info('sent non-party characters', list);
        return list;
      }),
    );
  }

  update(character: Character): void {
    const characters = this.updateSame(character);
    const subActions = [];
    for (const c of characters) {
      subActions.push(this.progressor.update(c));
      subActions.push(this.planner.update(c));
    }
    forkJoin(subActions).subscribe(_ => {
      this.logger.info('updated characters', characters);
      characters.forEach(c => this.characters.set(c.progress.id, c));
      this.updated.next();
    });
  }

  remove(character: Character): void {
    this.removeAll([character]);
  }

  removeAll(list: Character[]): void {
    const characters: Character[] = [];
    for (const c of list) {
      characters.push(...this.sameLevels(c));
    }
    const subActions = [
      this.progressor.removeAll(characters),
      this.planner.removeAll(characters),
    ];
    forkJoin(subActions).subscribe(_ => {
      this.logger.info('removed characters', characters);
      characters.forEach(it => this.characters.delete(it.progress.id));
      this.updated.next();
    });
  }

  private updateSame(character: Character): Character[] {
    const results = new Set<Character>();
    const {progress, plan} = character;
    for (const c of this.sameLevels(character)) {
      results.add(c);
      if (c === character) {
        copyLevel(c.progress, progress);
        copyLevel(c.plan, plan);
      }
    }
    for (const c of this.sameTalents(character)) {
      results.add(c);
      if (c !== character) {
        this.talents.copyProgress(c.progress.talents, progress.talents);
        this.talents.copyProgress(c.plan.talents, plan.talents);
      }
    }
    return [...results];
  }

  private sameLevels(target: Character): Character[] {
    return this.getSame(target, this.information.sameLevels);
  }

  private sameTalents(target: Character): Character[] {
    return this.getSame(target, this.information.sameTalents);
  }

  private getSame(target: Character, data: Map<number, number[]>): Character[] {
    const results = [];
    const targetId = target.progress.id;
    const ids = data.get(targetId);
    if (!ids) {
      return [target];
    }
    for (const id of ids) {
      const character = this.characters.get(id);
      if (character) {
        results.push(character);
        continue;
      }
      const info = this.information.infos.get(id);
      if (info) {
        const newCharacter = this.create(info);
        this.characters.set(newCharacter.progress.id, newCharacter);
        results.push(newCharacter);
      }
    }
    return results;
  }
}

type AscensionLevel = {ascension: Ascension; level: number};

function copyLevel(target: AscensionLevel, source: AscensionLevel): void {
  const {ascension, level} = source;
  Object.assign(target, {ascension, level});
}
