import {Injectable} from '@angular/core';
import {CharacterInfo} from '../models/character-info.model';
import {NGXLogger} from 'ngx-logger';
import {load, objectMap} from '../../shared/utils/json';
import {unionMap} from '../../shared/utils/collections';
import {CharacterStatsCurveLevel, CharacterStatsValue} from '../models/character-stats.model';
import {Character, CharacterOverview} from '../models/character.model';
import {StatsType, StatsValue} from '../../game-common/models/stats.model';
import itemList from '../../../data/character/character-list.json';
import statsCurvesLevel from '../../../data/character/character-stats-curve-level.json';
import {SettingService} from '../../setting/services/setting.service';
import {Gender} from '../models/gender.enum';
import {Observable, ReplaySubject} from 'rxjs';
import {CharacterInfoOptions} from '../models/character-options.model';
import {map} from 'rxjs/operators';
import {MaterialService} from '../../material/services/material.service';
import {TalentInfoService} from './talent-info.service';
import {MaterialDetail} from '../../material/models/material.model';
import {MaterialType} from '../../material/models/material-type.enum';
import {ItemInfoService} from '../../game-common/services/item-info.service';
import {AscensionLevel} from '../../game-common/models/ascension-level.model';

@Injectable({
  providedIn: 'root',
})
export class CharacterInfoService extends ItemInfoService<Character, CharacterOverview> {
  readonly infos = objectMap<CharacterInfo>(load(itemList));

  readonly travelersGendered = new Map([
    [Gender.MALE, [1001, 1002]],
    [Gender.FEMALE, [1011, 1012]],
  ]);

  readonly sameLevels = unionMap([[1001, 1002, 1011, 1012]]);

  readonly sameTalents = unionMap([
    [1001, 1011],
    [1002, 1012],
  ]);

  private statsLevel = load(statsCurvesLevel) as CharacterStatsCurveLevel;

  private readonly materialOrder = [
    MaterialType.TALENT_147,
    MaterialType.TALENT_257,
    MaterialType.TALENT_367,
    MaterialType.TALENT_COMMON,
    MaterialType.LOCAL_SPECIALTY,
    MaterialType.ENEMY_MOB,
    MaterialType.CHARACTER_GEM,
    MaterialType.CHARACTER_BOSS,
  ];

  private readonly settingKey = 'character-info';

  private options$ = new ReplaySubject<CharacterInfoOptions>(1);

  readonly options = this.options$.asObservable();

  constructor(
    private settings: SettingService,
    private talents: TalentInfoService,
    private materials: MaterialService,
    private logger: NGXLogger,
  ) {
    super();
    logger.info('loaded item list', this.infos);
    logger.info('loaded stats curves for level', this.statsLevel);
    settings
      .get(this.settingKey, {
        travelerGender: Gender.FEMALE,
      })
      .subscribe(options => this.options$.next(options));
  }

  getIgnoredIds(): Observable<Set<number>> {
    return this.options.pipe(
      map(({travelerGender}) => {
        return new Set<number>(
          Array.from(this.travelersGendered)
            .filter(([gender]) => gender !== travelerGender)
            .flatMap(([, travelers]) => travelers),
        );
      }),
    );
  }

  getOverview(item: Character): CharacterOverview {
    const {info, progress, plan} = item;
    const currentStats = this.getStatsValue(info, progress);
    const planStats = this.getStatsValue(info, plan);
    return {...item, currentStats, planStats};
  }

  getStatsValue(info: CharacterInfo, dependency: AscensionLevel): StatsValue {
    const result = new CharacterStatsValue();
    const {stats, curvesAscension} = info;
    const {ascension, level} = dependency;
    for (const [type, statsInfo] of Object.entries(stats)) {
      if (statsInfo) {
        const statsType = type as StatsType;
        const {initial, curve} = statsInfo;
        const value = !curve ? initial : initial * this.statsLevel[curve][level];
        if (isNaN(value)) {
          return result.asWrong();
        }
        result.add(statsType, value);
      }
    }
    for (const [type, values] of Object.entries(curvesAscension)) {
      if (values) {
        const statsType = type as StatsType;
        const value = values[ascension];
        if (isNaN(value)) {
          return result.asWrong();
        }
        result.add(statsType, value);
      }
    }
    return result;
  }

  getRequireMaterials(info: CharacterInfo): MaterialDetail[] {
    const ids = this.talents
      .getUpgradableInfos(info)
      .flatMap(({materials}) => [...materials.domain, materials.boss, materials.mob]);
    const {boss, gem, local} = info.materials;
    if (boss) {
      ids.push(boss);
    }
    ids.push(gem);
    ids.push(local);
    return this.materials.getRequireMaterials(ids, this.materialOrder);
  }

  changeTravelerGender(travelerGender: Gender): void {
    this.updateSetting({travelerGender});
  }

  private updateSetting(update: Partial<CharacterInfoOptions>): void {
    this.settings.update(this.settingKey, update);
  }
}
