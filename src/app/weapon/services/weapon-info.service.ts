import {Injectable} from '@angular/core';
import {WeaponInfo} from '../models/weapon-info.model';
import {NGXLogger} from 'ngx-logger';
import {objectMap} from '../../shared/utils/collections';
import {
  WeaponStatsCurveAscension,
  WeaponStatsCurveLevel,
  WeaponStatsValue,
} from '../models/weapon-stats.model';
import {Ascension} from '../../game-common/models/ascension.type';
import {Weapon, WeaponOverview} from '../models/weapon.model';
import {StatsType} from '../../game-common/models/stats.model';
import weaponList from '../../../assets/data/weapons/weapon-list.json';
import weaponStatsCurveLevel from '../../../assets/data/weapons/weapon-stats-curve-level.json';
import weaponStatsCurveAscension from '../../../assets/data/weapons/weapon-stats-curve-ascension.json';

/**
 * Represents the dependency of weapon stats value.
 */
export type WeaponStatsDependency = {ascension: Ascension; level: number};

@Injectable({
  providedIn: 'root',
})
export class WeaponInfoService {
  readonly infos = objectMap<WeaponInfo>(
    JSON.parse(JSON.stringify(weaponList)),
  );

  private statsCurvesLevel = weaponStatsCurveLevel as WeaponStatsCurveLevel;

  private statsCurvesAscension = weaponStatsCurveAscension as WeaponStatsCurveAscension;

  constructor(private logger: NGXLogger) {}

  getOverview(weapon: Weapon): WeaponOverview {
    const {info, progress, plan} = weapon;
    const currentStats = this.getStatsValue(info, progress);
    const planStats = this.getStatsValue(info, plan);
    const overview = {
      ...weapon,
      currentStats,
      planStats,
    };
    this.logger.info('sent weapon overview', overview);
    return overview;
  }

  getStatsValue(
    {id, rarity, stats}: WeaponInfo,
    dependency: WeaponStatsDependency,
  ): WeaponStatsValue {
    const {ascension, level} = dependency;
    const result = new WeaponStatsValue();
    for (const [type, statsInfo] of Object.entries(stats)) {
      const statsType = type as StatsType;
      if (statsInfo) {
        const {initial, curve} = statsInfo;
        const value = initial * this.statsCurvesLevel[curve][level];
        result.add(statsType, value);
        const curveAscension = this.statsCurvesAscension[rarity][statsType];
        if (curveAscension) {
          result.add(statsType, curveAscension[ascension]);
        }
      }
    }
    this.logger.info('sent weapon stats', id, dependency, result);
    return result;
  }
}
