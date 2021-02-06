import {Injectable} from '@angular/core';
import {forkJoin, Observable, ReplaySubject, zip} from 'rxjs';
import {WeaponInfo} from '../models/weapon-info.model';
import {HttpClient} from '@angular/common/http';
import {NGXLogger} from 'ngx-logger';
import {objectMap} from '../../shared/utils/collections';
import {first, map, tap} from 'rxjs/operators';
import {WeaponStatsCurveAscension, WeaponStatsCurveLevel, WeaponStatsType, WeaponStatsValue} from '../models/weapon-stats.model';
import {Ascension} from '../../game-common/models/ascension.type';
import {Weapon, WeaponWithStats} from '../models/weapon.model';

/**
 * Represents the dependency of weapon stats value.
 */
export type WeaponStatsDependency = { ascension: Ascension, level: number };

@Injectable({
  providedIn: 'root'
})
export class WeaponInfoService {

  private readonly prefix = 'assets/data/weapons';

  private readonly items$ = new ReplaySubject<Map<number, WeaponInfo>>(1);

  readonly items = this.items$.asObservable();

  private readonly curvesLevel = new ReplaySubject<WeaponStatsCurveLevel>(1);

  private readonly curvesAscension = new ReplaySubject<WeaponStatsCurveAscension>(1);

  constructor(http: HttpClient, private logger: NGXLogger) {
    http.get<{ [id: number]: WeaponInfo }>(`${this.prefix}/weapons.json`).subscribe(data => {
      const weapons = objectMap(data);
      this.logger.info('loaded weapon data', weapons);
      this.items$.next(weapons);
    });
    http.get<WeaponStatsCurveLevel>(`${this.prefix}/weapon-stats-curve-level.json`).subscribe(data => {
      this.logger.info('loaded weapon stats curves per level data', data);
      this.curvesLevel.next(data);
    });
    http.get<WeaponStatsCurveAscension>(`${this.prefix}/weapon-stats-curve-ascension.json`).subscribe(data => {
      this.logger.info('loaded weapon stats curves per ascension data', data);
      this.curvesAscension.next(data);
    });
  }

  getStats(weapon: Weapon): Observable<WeaponWithStats> {
    const {info, progress, plan} = weapon;
    return forkJoin([this.getStatsValue(info, progress), this.getStatsValue(info, plan)]).pipe(
      map(([currentStats, planStats]) => ({...weapon, currentStats, planStats})),
      tap(stats => this.logger.info('sent weapon stats', stats))
    );
  }

  getStatsValue({id, rarity, stats}: WeaponInfo, dependency: WeaponStatsDependency): Observable<WeaponStatsValue> {
    return zip(this.curvesLevel, this.curvesAscension).pipe(
      first(),
      map(([curvesLevel, curvesAscension]) => {
        const {ascension, level} = dependency;
        const result: WeaponStatsValue = {};
        for (const [type, statsInfo] of Object.entries(stats)) {
          const statsType = type as WeaponStatsType;
          if (statsInfo) {
            const {initial, curve} = statsInfo;
            const value = initial * curvesLevel[curve][level];
            const curveAscension = curvesAscension[rarity][statsType];
            result[statsType] = !curveAscension ? value : value + curveAscension[ascension];
          }
        }
        this.logger.info('sent weapon stats', id, dependency, result);
        return result;
      })
    );
  }
}
