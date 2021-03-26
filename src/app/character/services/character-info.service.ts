import {Injectable} from '@angular/core';
import {CharacterInfo} from '../models/character-info.model';
import {NGXLogger} from 'ngx-logger';
import {objectMap, load} from '../../shared/utils/json';
import {unionMap} from '../../shared/utils/collections';
import {
  CharacterStatsCurveLevel,
  CharacterStatsValue,
} from '../models/character-stats.model';
import {Ascension} from '../../game-common/models/ascension.type';
import {Character, CharacterOverview} from '../models/character.model';
import {StatsType} from '../../game-common/models/stats.model';
import characterList from '../../../data/characters/character-list.json';
import statsCurvesLevel from '../../../data/characters/character-stats-curve-level.json';
import {SettingService} from '../../setting/services/setting.service';
import {allGenders, Gender} from '../models/gender.enum';
import {Observable, ReplaySubject} from 'rxjs';
import {
  CharacterInfoOptions,
  defaultCharacterInfoOptions,
} from '../models/options.model';
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
  private i18n = new I18n('characters');

  private readonly settingKey = 'character-info';

  readonly infos = objectMap<CharacterInfo>(load(characterList));

  private statsLevel = load(statsCurvesLevel) as CharacterStatsCurveLevel;

  readonly genders = allGenders.map(value => ({
    value,
    text: this.i18n.dict(`genders.${value}`),
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
    settings
      .get(this.settingKey, defaultCharacterInfoOptions)
      .subscribe(options => this.options$.next(options));
  }

  ignoredIds(): Observable<number[]> {
    return this.options.pipe(
      first(),
      map(options => {
        const genderOption = options.travelerGender;
        const shouldRemove: number[] = [];
        for (const [gender, travelers] of this.travelersGendered) {
          if (gender !== genderOption) {
            shouldRemove.push(...travelers);
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
    const {id, stats, curvesAscension} = info;
    const {ascension, level} = dependency;
    const result = new CharacterStatsValue();
    for (const [type, statsInfo] of Object.entries(stats)) {
      const statsType = type as StatsType;
      if (statsInfo) {
        const {initial, curve} = statsInfo;
        const curvesLevel = this.statsLevel;
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
  }

  getMaterials(character: CharacterInfo): MaterialDetail[] {
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

  changeTravelerGender(travelerGender: Gender): void {
    this.updateSetting({travelerGender});
  }

  private updateSetting(update: Partial<CharacterInfoOptions>): void {
    this.options.pipe(first()).subscribe(options => {
      Object.assign(options, update);
      this.settings.set(this.settingKey, options);
    });
  }
}
