import {Injectable} from '@angular/core';
import {EMPTY, forkJoin, Observable, of, ReplaySubject, zip} from 'rxjs';
import {Character, CharacterWithStats} from '../models/character.model';
import {allCharacterRarities, CharacterInfo} from '../models/character-info.model';
import {first, map, mergeMap, switchMap, tap, throwIfEmpty} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';
import {CharacterInfoService} from './character-info.service';
import {CharacterProgressService} from './character-progress.service';
import {CharacterPlanner} from './character-planner.service';
import {RequirementDetail} from '../../material/models/requirement-detail.model';
import {MaterialService} from '../../material/services/material.service';
import {elementTypeList} from '../../game-common/models/element-type.enum';
import {weaponTypeList} from '../../weapon/models/weapon-type.enum';
import {I18n} from '../../widget/models/i18n.model';
import {StatsType} from '../../game-common/models/stats.model';
import {ItemType} from '../../game-common/models/item-type.enum';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  private readonly i18n = new I18n('characters');

  private readonly characters$ = new ReplaySubject<Map<number, Character>>(1);

  readonly characters = this.characters$.asObservable();

  readonly nonParty = this.progressor.noProgress.pipe(map(infos => [...infos.values()]));

  readonly sorts: { text: string, value: (a: Character, b: Character) => number }[] = [
    {text: this.i18n.dict('level'), value: ({progress: a}, {progress: b}) => b.ascension - a.ascension || b.level - a.level},
    {text: this.i18n.dict('rarity'), value: ({info: a}, {info: b}) => b.rarity - a.rarity},
    {text: this.i18n.dict('constellation'), value: ({progress: a}, {progress: b}) => b.constellation - a.constellation},
  ];

  sort = this.sorts[0].value;

  readonly infoSorts: { text: string, value: (a: CharacterInfo, b: CharacterInfo) => number }[] = [
    {text: this.i18n.dict('rarity'), value: (a, b) => b.rarity - a.rarity},
  ];

  infoSort = this.infoSorts[0].value;

  readonly rarities = allCharacterRarities.map(it => ({value: it, text: `★${it}`}));

  rarityFilter = allCharacterRarities;

  readonly elements = elementTypeList.map(it => ({value: it, text: this.i18n.dict(`elements.${it}`)}));

  elementFilter = elementTypeList;

  readonly weapons = weaponTypeList.map(it => ({value: it, text: this.i18n.dict(`weapon-types.${it}`)}));

  weaponFilter = weaponTypeList;

  constructor(private information: CharacterInfoService, private progressor: CharacterProgressService,
              private planner: CharacterPlanner, private materials: MaterialService, private logger: NGXLogger) {
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
            return this.planner.getRequirement(character)
              .pipe(switchMap(req => this.materials.updateRequirement(ItemType.CHARACTER, character.progress.id, req)));
          });
          return forkJoin(requirementObs);
        })
      )
      .subscribe(_ => this.logger.info('loaded the requirements of all characters'));
  }

  create(info: CharacterInfo): Observable<CharacterWithStats> {
    const id = info.id;
    const progress = this.progressor.create(info, id);
    const plan = this.planner.create(info, id);
    const character = {info, progress, plan};
    return this.information.getStats(character);
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

  getRequirementDetails(character: Character): Observable<RequirementDetail[]> {
    return this.planner.getRequirementDetails(character);
  }

  getOverview(character: Character): Observable<CharacterWithStats> {
    return this.information.getStats(character);
  }

  getStatsTypes(character: CharacterWithStats): StatsType[] {
    const stats = character.currentStats;
    const curvesAscension = character.info.curvesAscension;
    const types = new Set([...Object.keys(stats), ...Object.keys(curvesAscension)]);
    return [...types].filter(it => curvesAscension.hasOwnProperty(it)) as StatsType[];
  }

  getAll(): Observable<CharacterWithStats[]> {
    return this.characters.pipe(
      switchMap(characters => {
        if (characters.size === 0) {
          return of([]);
        }
        const statsObs: Observable<CharacterWithStats>[] = [];
        for (const character of characters.values()) {
          statsObs.push(this.information.getStats(character));
        }
        return forkJoin(statsObs);
      }),
      tap(characters => this.logger.info('sent characters', characters)),
    );
  }

  view(characters: CharacterWithStats[]): CharacterWithStats[] {
    return characters.filter(c => this.filterInfo(c.info)).sort((a, b) => this.sort(a, b) || b.info.id - a.info.id);
  }

  viewInfos(characters: CharacterInfo[]): CharacterInfo[] {
    return characters.filter(c => this.filterInfo(c)).sort((a, b) => this.infoSort(a, b) || b.id - a.id);
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
        mergeMap(_ => this.planner.getRequirement(character)),
        mergeMap(req => this.materials.updateRequirement(ItemType.CHARACTER, character.progress.id, req)),
      )
      .subscribe(_ => this.logger.info('updated character', character));
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
        mergeMap(_ => this.materials.removeRequirement(ItemType.CHARACTER, character.progress.id)),
      )
      .subscribe(_ => this.logger.info('removed character', character));
  }

  removeAll(characterList: Character[]): void {
    this.characters
      .pipe(
        first(),
        map(characters => {
          characterList.forEach(character => characters.delete(character.progress.id));
          this.characters$.next(characters);
        }),
        mergeMap(_ => this.progressor.removeAll(characterList)),
        mergeMap(_ => this.planner.removeAll(characterList)),
        mergeMap(_ => this.materials.removeAllRequirement(ItemType.CHARACTER, characterList.map(it => it.progress.id))),
      )
      .subscribe(_ => this.logger.info('removed characters', characterList));
  }

  private filterInfo({element, rarity, weapon}: CharacterInfo): boolean {
    return this.rarityFilter.includes(rarity) && this.elementFilter.includes(element) && this.weaponFilter.includes(weapon);
  }
}
