import {Injectable} from '@angular/core';
import {WeaponInfo} from '../models/weapon-info.model';
import {NGXLogger} from 'ngx-logger';
import {load, objectMap} from '../../shared/utils/json';
import {
  WeaponStatsCurveAscension,
  WeaponStatsCurveLevel,
  WeaponStatsValue,
} from '../models/weapon-stats.model';
import {Weapon, WeaponOverview} from '../models/weapon.model';
import {StatsType} from '../../game-common/models/stats.model';
import itemList from '../../../data/weapon/weapon-list.json';
import statsLevel from '../../../data/weapon/weapon-stats-curve-level.json';
import statsAscension from '../../../data/weapon/weapon-stats-curve-ascension.json';
import {MaterialDetail} from '../../material/models/material.model';
import {MaterialService} from '../../material/services/material.service';
import {MaterialType} from '../../material/models/material-type.enum';
import {TranslateService} from '@ngx-translate/core';
import {allRefineRanks, RefineRank} from '../models/weapon-progress.model';
import {I18n} from '../../widget/models/i18n.model';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {ItemInfoService} from '../../game-common/services/item-info.service';
import {AscensionLevel} from '../../game-common/models/ascension-level.model';

@Injectable({
  providedIn: 'root',
})
export class WeaponInfoService extends ItemInfoService<Weapon, WeaponOverview> {
  readonly i18n = I18n.create('weapon');

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
    private sanitizer: DomSanitizer,
    private logger: NGXLogger,
  ) {
    super();
    logger.info('loaded item list', this.infos);
    logger.info('loaded stats curves for level', this.statsLevel);
    logger.info('loaded stats curves for ascension', this.statsAscension);
  }

  getOverview(item: Weapon): WeaponOverview {
    const {info, progress, plan} = item;
    const currentStats = this.getStatsValue(info, progress);
    const planStats = this.getStatsValue(info, plan);
    return {...item, currentStats, planStats};
  }

  getStatsValue({id, rarity, stats}: WeaponInfo, dependency: AscensionLevel): WeaponStatsValue {
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

  getAbilityDesc(info: WeaponInfo, refines: RefineRank[]): SafeHtml {
    const {id, descValues} = info.ability;
    const key = this.i18n.data('weapon-ability', id, 'desc');
    let desc: string = this.translator.instant(key);
    const start = Math.max(refines[0], allRefineRanks[0]) - 1;
    const end = Math.min(refines[refines.length - 1], descValues.length);
    for (let i = 0; i < descValues[0].length; i++) {
      const fields = [];
      for (let j = start; j < end; j++) {
        fields.push(descValues[j][i]);
      }
      desc = desc.replace(/{(\S+?)}/, `<b class="$1">[${fields.join(' / ')}]</b>`);
    }
    return this.sanitizer.bypassSecurityTrustHtml(desc);
  }

  getRequireMaterials({materials}: WeaponInfo): MaterialDetail[] {
    const ids = [materials.domain, materials.elite, materials.mob];
    return this.materials.getRequireMaterials(ids, this.materialOrder);
  }
}
