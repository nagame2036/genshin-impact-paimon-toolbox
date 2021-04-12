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
import itemList from '../../../data/weapons/weapon-list.json';
import statsLevel from '../../../data/weapons/weapon-stats-curve-level.json';
import statsAscension from '../../../data/weapons/weapon-stats-curve-ascension.json';
import {MaterialDetail} from '../../material/models/material.model';
import {MaterialService} from '../../material/services/material.service';
import {MaterialType} from '../../material/models/material-type.enum';
import {TranslateService} from '@ngx-translate/core';
import {allRefineRanks, RefineRank} from '../models/weapon-progress.model';
import {I18n} from '../../widget/models/i18n.model';

/**
 * Represents the dependency of weapon stats value.
 */
type WeaponStatsDependency = {ascension: Ascension; level: number};

@Injectable({
  providedIn: 'root',
})
export class WeaponInfoService {
  private i18n = I18n.create('weapons');

  readonly infos = objectMap<WeaponInfo>(load(itemList));

  private statsLevel = load(statsLevel) as WeaponStatsCurveLevel;

  private statsAscension = load(statsAscension) as WeaponStatsCurveAscension;

  private readonly materialOrder = [
    MaterialType.WEAPON_147,
    MaterialType.WEAPON_257,
    MaterialType.WEAPON_367,
    MaterialType.ENEMY_ELITE,
    MaterialType.ENEMY_MOB,
  ];

  constructor(
    private materials: MaterialService,
    private translator: TranslateService,
    private logger: NGXLogger,
  ) {
    logger.info('loaded item list', this.infos);
    logger.info('loaded stats curves for level', this.statsLevel);
    logger.info('loaded stats curves for ascension', this.statsAscension);
  }

  getOverview(weapon: Weapon): WeaponOverview {
    const {info, progress, plan} = weapon;
    const currentStats = this.getStatsValue(info, progress);
    const planStats = this.getStatsValue(info, plan);
    return {...weapon, currentStats, planStats};
  }

  getStatsValue(
    {id, rarity, stats}: WeaponInfo,
    dependency: WeaponStatsDependency,
  ): WeaponStatsValue {
    const result = new WeaponStatsValue();
    const {ascension, level} = dependency;
    for (const [type, statsInfo] of Object.entries(stats)) {
      if (!statsInfo) {
        continue;
      }
      const statsType = type as StatsType;
      const {initial, curve} = statsInfo;
      const value = initial * this.statsLevel[curve][level];
      result.add(statsType, value);
      const curveAscension = this.statsAscension[rarity][statsType];
      if (curveAscension) {
        result.add(statsType, curveAscension[ascension]);
      }
    }
    return result;
  }

  getAbilityDesc(info: WeaponInfo, start: RefineRank, end: RefineRank): string {
    const {id, descValues} = info.ability;
    const key = this.i18n.data('weapon-ability', id, 'desc');
    let desc: string = this.translator.instant(key);
    const left = Math.max(start, allRefineRanks[0]) - 1;
    const right = Math.min(end, descValues.length);
    for (let i = 0; i < descValues[0].length; i++) {
      const fields = [];
      for (let j = left; j < right; j++) {
        fields.push(descValues[j][i]);
      }
      const param = right - left <= 1 ? fields[0] : ` (${fields.join(' / ')}) `;
      desc = desc.replace('{}', `<b>${param}</b>`);
    }
    return desc;
  }

  getRequireMaterials({materials}: WeaponInfo): MaterialDetail[] {
    const ids = [materials.domain, materials.elite, materials.mob];
    return this.materials.getRequireMaterials(ids, this.materialOrder);
  }
}
