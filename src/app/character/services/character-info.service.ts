import {Injectable} from '@angular/core';
import {forkJoin, Observable, ReplaySubject} from 'rxjs';
import {CharacterInfo} from '../models/character-info.model';
import {HttpClient} from '@angular/common/http';
import {NGXLogger} from 'ngx-logger';
import {objectMap} from '../../shared/utils/collections';
import {
  CharacterStatsCurveLevel,
  CharacterStatsValue,
} from '../models/character-stats.model';
import {first, map, tap} from 'rxjs/operators';
import {Ascension} from '../../game-common/models/ascension.type';
import {Character, CharacterOverview} from '../models/character.model';
import {StatsType} from '../../game-common/models/stats.model';
import {characterData} from './character-data';

/**
 * Represents the dependency of character stats value.
 */
type CharacterStatsDependency = { ascension: Ascension; level: number };

@Injectable({
  providedIn: 'root',
})
export class CharacterInfoService {
  private readonly infos$ = new ReplaySubject<Map<number, CharacterInfo>>(1);

  readonly infos = this.infos$.asObservable();

  private statsCurvesLevel = new ReplaySubject<CharacterStatsCurveLevel>(1);

  constructor(http: HttpClient, private logger: NGXLogger) {
    http
      .get<{[id: number]: CharacterInfo}>(characterData('characters'))
      .subscribe(data => {
        const characters = objectMap(data);
        this.logger.info('loaded character data', characters);
        this.infos$.next(characters);
      });
    http
      .get<CharacterStatsCurveLevel>(
        characterData('character-stats-curve-level'),
      )
      .subscribe(data => {
        this.logger.info('loaded character stats curves per level data', data);
        this.statsCurvesLevel.next(data);
      });
  }

  getOverview(character: Character): Observable<CharacterOverview> {
    const {info, progress, plan} = character;
    const sources = [
      this.getStatsValue(info, progress),
      this.getStatsValue(info, plan),
    ];
    return forkJoin(sources).pipe(
      map(([currentStats, planStats]) => ({
        ...character,
        currentStats,
        planStats,
      })),
      tap(stats => this.logger.info('sent character stats', stats)),
    );
  }

  getStatsValue(
    info: CharacterInfo,
    dependency: CharacterStatsDependency,
  ): Observable<CharacterStatsValue> {
    const {id, stats, curvesAscension} = info;
    return this.statsCurvesLevel.pipe(
      first(),
      map(curvesLevel => {
        const {ascension, level} = dependency;
        const result = new CharacterStatsValue();
        for (const [type, statsInfo] of Object.entries(stats)) {
          const statsType = type as StatsType;
          if (statsInfo) {
            const {initial, curve} = statsInfo;
            const value = curve ? initial * curvesLevel[curve][level] : initial;
            result.add(statsType, value);
          }
        }
        for (const [type, values] of Object.entries(curvesAscension)) {
          const statsType = type as StatsType;
          if (values) {
            const value = values[ascension];
            result.add(statsType, value);
          }
        }
        this.logger.info('sent character stats', id, dependency, result);
        return result;
      }),
    );
  }
}
