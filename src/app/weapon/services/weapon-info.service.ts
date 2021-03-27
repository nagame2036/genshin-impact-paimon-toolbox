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
import {TranslateService} from '@ngx-translate/core';
import {allRefineRanks, RefineRank} from '../models/weapon-progress.model';
import {allWeaponAbilities} from '../models/weapon-ability.model';
import {I18n} from '../../widget/models/i18n.model';

/**
 * Represents the dependency of weapon stats value.
 */
export type WeaponStatsDependency = {ascension: Ascension; level: number};

@Injectable({
  providedIn: 'root',
})
export class WeaponInfoService {
  private i18n = new I18n('weapons');

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

  constructor(
    private materials: MaterialService,
    private translator: TranslateService,
    private logger: NGXLogger,
  ) {}

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

  getAbilityDesc(
    {ability: {id, params}}: WeaponInfo,
    refineStart: RefineRank,
    refineEnd: RefineRank,
  ): string {
    const ability = allWeaponAbilities[id];
    if (!ability) {
      return '';
    }
    const start = Math.max(refineStart, allRefineRanks[0]) - 1;
    const end = Math.min(refineEnd, params.length);
    const paramList = params.map(p => ability.desc(p));
    const paramArray: string[][] = [];
    for (let i = 0; i < paramList[0].length; i++) {
      const paramFields = [];
      for (let j = start; j < end; j++) {
        paramFields.push(paramList[j][i]);
      }
      paramArray.push(paramFields);
    }
    const paramTexts = paramArray.map(it => {
      const p = new Set(it).size <= 1 ? it[0] : ' (' + it.join(' / ') + ') ';
      return `<b>${p}</b>`;
    });
    const key = this.i18n.dict(`weapon-abilities.${id}.desc`);
    let text: string = this.translator.instant(key);
    paramTexts.forEach(p => (text = text.replace('{}', p)));
    return text;
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
