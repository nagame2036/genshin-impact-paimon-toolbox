import {Injectable} from '@angular/core';
import {WeaponInfo} from '../models/weapon-info.model';
import {NGXLogger} from 'ngx-logger';
import {load, objectMap} from '../../shared/utils/json';
import {
  WeaponStatsCurveAscension,
  WeaponStatsCurveLevel,
  WeaponStatsValue,
} from '../models/weapon-stats.model';
import {Ascension} from '../../game-common/models/ascension.type';
import {Weapon, WeaponOverview} from '../models/weapon.model';
import {StatsType} from '../../game-common/models/stats.model';
import weaponList from '../../../data/weapons/weapon-list.json';
import statsLevel from '../../../data/weapons/weapon-stats-curve-level.json';
import statsAscension from '../../../data/weapons/weapon-stats-curve-ascension.json';
import {MaterialDetail} from '../../material/models/material.model';
import {MaterialService} from '../../material/services/material.service';
import {MaterialType} from '../../material/models/material-type.enum';

/**
 * Represents the dependency of weapon stats value.
 */
export type WeaponStatsDependency = {ascension: Ascension; level: number};

@Injectable({
  providedIn: 'root',
})
export class WeaponInfoService {
  readonly infos = objectMap<WeaponInfo>(load(weaponList));

  private statsLevel = load(statsLevel) as WeaponStatsCurveLevel;

  private statsAscension = load(statsAscension) as WeaponStatsCurveAscension;

  private readonly materialOrder = [
    MaterialType.WEAPON_147,
    MaterialType.WEAPON_257,
    MaterialType.WEAPON_367,
    MaterialType.ENEMY_ELITE,
    MaterialType.ENEMY_MOB,
  ];

  constructor(private materials: MaterialService, private logger: NGXLogger) {}

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
        const value = initial * this.statsLevel[curve][level];
        result.add(statsType, value);
        const curveAscension = this.statsAscension[rarity][statsType];
        if (curveAscension) {
          result.add(statsType, curveAscension[ascension]);
        }
      }
    }
    this.logger.info('sent weapon stats', id, dependency, result);
    return result;
  }

  getMaterials(weapon: WeaponInfo): MaterialDetail[] {
    const ids = [];
    const weaponMaterials = weapon.materials;
    ids.push(weaponMaterials.domain);
    ids.push(weaponMaterials.elite);
    ids.push(weaponMaterials.mob);
    const result = [];
    for (const id of new Set(ids)) {
      const material = this.materials.getHighestRarityByIdOrGroupId(id);
      if (material) {
        result.push(material);
      }
    }
    const order = this.materialOrder;
    return result.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));
  }
}
