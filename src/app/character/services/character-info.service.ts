import {Injectable} from '@angular/core';
import {CharacterInfo} from '../models/character-info.model';
import {NGXLogger} from 'ngx-logger';
import {load, objectMap} from '../../shared/utils/json';
import {unionMap} from '../../shared/utils/collections';
import {CharacterStatsCurveLevel, CharacterStatsValue,} from '../models/character-stats.model';
import {Ascension} from '../../game-common/models/ascension.type';
import {Character, CharacterOverview} from '../models/character.model';
import {StatsType} from '../../game-common/models/stats.model';
import itemList from '../../../data/characters/character-list.json';
import statsCurvesLevel from '../../../data/characters/character-stats-curve-level.json';
import {SettingService} from '../../setting/services/setting.service';
import {allGenders, Gender} from '../models/gender.enum';
import {Observable, ReplaySubject} from 'rxjs';
import {CharacterInfoOptions, defaultCharacterInfoOptions,} from '../models/character-options.model';
import {first, map} from 'rxjs/operators';
import {I18n} from '../../widget/models/i18n.model';
import {MaterialService} from '../../material/services/material.service';
import {TalentInfoService} from './talent-info.service';
import {MaterialDetail} from '../../material/models/material.model';
import {MaterialType} from '../../material/models/material-type.enum';

/**
 * Represents the dependency of character stats value.
 */
type CharacterStatsDependency = {ascension: Ascension; level: number};

@Injectable({
  providedIn: 'root',
})
export class CharacterInfoService {
  private i18n = I18n.create('characters');

  private readonly settingKey = 'character-info';

  readonly infos = objectMap<CharacterInfo>(load(itemList));

  private statsLevel = load(statsCurvesLevel) as CharacterStatsCurveLevel;

  readonly genders = allGenders.map(value => ({
    value,
    text: this.i18n.data(`gender.${value}`),
  }));

  readonly travelersGendered = new Map([
    [Gender.MALE, [1001, 1002]],
    [Gender.FEMALE, [1011, 1012]],
  ]);

  readonly sameLevels = unionMap([[1001, 1002, 1011, 1012]]);

  readonly sameTalents = unionMap([
    [1001, 1011],
    [1002, 1012],
  ]);

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

  private options$ = new ReplaySubject<CharacterInfoOptions>(1);

  readonly options = this.options$.asObservable();

  constructor(
    private settings: SettingService,
    private talents: TalentInfoService,
    private materials: MaterialService,
    private logger: NGXLogger,
  ) {
    logger.info('loaded item list', this.infos);
    logger.info('loaded stats curves for level', this.statsLevel);
    settings
      .get(this.settingKey, defaultCharacterInfoOptions)
      .subscribe(options => this.options$.next(options));
  }

  getIgnoredIds(): Observable<Set<number>> {
    return this.options.pipe(
      first(),
      map(options => {
        const genderOption = options.travelerGender;
        const shouldRemove = new Set<number>();
        for (const [gender, travelers] of this.travelersGendered) {
          if (gender !== genderOption) {
            travelers.forEach(t => shouldRemove.add(t));
          }
        }
        return shouldRemove;
      }),
    );
  }

  getOverview(character: Character): CharacterOverview {
    const {info, progress, plan} = character;
    const currentStats = this.getStatsValue(info, progress);
    const planStats = this.getStatsValue(info, plan);
    const overview = {...character, currentStats, planStats};
    this.logger.info('sent character stats', overview);
    return overview;
  }

  getStatsValue(
    info: CharacterInfo,
    dependency: CharacterStatsDependency,
  ): CharacterStatsValue {
    const result = new CharacterStatsValue();
    const {id, stats, curvesAscension} = info;
    const {ascension, level} = dependency;
    for (const [type, statsInfo] of Object.entries(stats)) {
      if (statsInfo) {
        const statsType = type as StatsType;
        const {initial, curve} = statsInfo;
        const curvesLevel = this.statsLevel;
        const value = curve ? initial * curvesLevel[curve][level] : initial;
        result.add(statsType, value);
      }
    }
    for (const [type, values] of Object.entries(curvesAscension)) {
      if (values) {
        const statsType = type as StatsType;
        const value = values[ascension];
        result.add(statsType, value);
      }
    }
    this.logger.info('sent character stats', id, dependency, result);
    return result;
  }

  getRequireMaterials(character: CharacterInfo): MaterialDetail[] {
    const ids = [];
    for (const t of this.talents.getAll(character.talentsUpgradable)) {
      const materials = t.materials;
      if (materials) {
        ids.push(...materials.domain);
        ids.push(materials.boss);
        ids.push(materials.mob);
      }
    }
    const characterMaterials = character.materials;
    if (characterMaterials.boss) {
      ids.push(characterMaterials.boss);
    }
    ids.push(characterMaterials.gem);
    ids.push(characterMaterials.local);
    return this.materials.getRequireMaterials(ids, this.materialOrder);
  }

  changeTravelerGender(travelerGender: Gender): void {
    this.updateSetting({travelerGender});
  }

  private updateSetting(update: Partial<CharacterInfoOptions>): void {
    this.settings.update(this.settingKey, update);
  }
}
