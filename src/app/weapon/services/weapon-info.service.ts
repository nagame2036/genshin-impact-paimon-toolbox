import {Injectable} from '@angular/core';
import {forkJoin, Observable, ReplaySubject, zip} from 'rxjs';
import {WeaponInfo} from '../models/weapon-info.model';
import {HttpClient} from '@angular/common/http';
import {NGXLogger} from 'ngx-logger';
import {objectMap} from '../../shared/utils/collections';
import {first, map} from 'rxjs/operators';
import {
  WeaponStatsCurveAscension,
  WeaponStatsCurveLevel,
  WeaponStatsValue,
} from '../models/weapon-stats.model';
import {Ascension} from '../../game-common/models/ascension.type';
import {Weapon, WeaponOverview} from '../models/weapon.model';
import {StatsType} from '../../game-common/models/stats.model';
import {weaponData} from './weapon-data';

/**
 * Represents the dependency of weapon stats value.
 */
export type WeaponStatsDependency = {ascension: Ascension; level: number};

@Injectable({
  providedIn: 'root',
})
export class WeaponInfoService {
  private readonly infos$ = new ReplaySubject<Map<number, WeaponInfo>>(1);

  readonly infos = this.infos$.asObservable();

  private readonly statsCurvesLevel = new ReplaySubject<WeaponStatsCurveLevel>(
    1,
  );

  private readonly statsCurvesAscension = new ReplaySubject<WeaponStatsCurveAscension>(
    1,
  );

  constructor(http: HttpClient, private logger: NGXLogger) {
    http
      .get<{[id: number]: WeaponInfo}>(weaponData('weapons.json'))
      .subscribe(data => {
        const weapons = objectMap(data);
        this.logger.info('loaded weapon data', weapons);
        this.infos$.next(weapons);
      });
    http
      .get<WeaponStatsCurveLevel>(weaponData('weapon-stats-curve-level'))
      .subscribe(data => {
        this.logger.info('loaded weapon stats curves per level data', data);
        this.statsCurvesLevel.next(data);
      });
    http
      .get<WeaponStatsCurveAscension>(
        weaponData('weapon-stats-curve-ascension'),
      )
      .subscribe(data => {
        this.logger.info('loaded weapon stats curves per ascension data', data);
        this.statsCurvesAscension.next(data);
      });
  }

  getOverview(weapon: Weapon): Observable<WeaponOverview> {
    const {info, progress, plan} = weapon;
    const statsObs = [
      this.getStatsValue(info, progress),
      this.getStatsValue(info, plan),
    ];
    return forkJoin(statsObs).pipe(
      map(([currentStats, planStats]) => {
        const overview = {
          ...weapon,
          currentStats,
          planStats,
        };
        this.logger.info('sent weapon overview', overview);
        return overview;
      }),
    );
  }

  getStatsValue(
    {id, rarity, stats}: WeaponInfo,
    dependency: WeaponStatsDependency,
  ): Observable<WeaponStatsValue> {
    return zip(this.statsCurvesLevel, this.statsCurvesAscension).pipe(
      first(),
      map(([curvesLevel, curvesAscension]) => {
        const {ascension, level} = dependency;
        const result = new WeaponStatsValue();
        for (const [type, statsInfo] of Object.entries(stats)) {
          const statsType = type as StatsType;
          if (statsInfo) {
            const {initial, curve} = statsInfo;
            const value = initial * curvesLevel[curve][level];
            result.add(statsType, value);
            const curveAscension = curvesAscension[rarity][statsType];
            if (curveAscension) {
              result.add(statsType, curveAscension[ascension]);
            }
          }
        }
        this.logger.info('sent weapon stats', id, dependency, result);
        return result;
      }),
    );
  }
}
