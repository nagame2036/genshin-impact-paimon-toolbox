import {Injectable} from '@angular/core';
import {CharacterInfo} from '../models/character-info.model';
import {NGXLogger} from 'ngx-logger';
import {objectMap, unionMap} from '../../shared/utils/collections';
import {
  CharacterStatsCurveLevel,
  CharacterStatsValue,
} from '../models/character-stats.model';
import {Ascension} from '../../game-common/models/ascension.type';
import {Character, CharacterOverview} from '../models/character.model';
import {StatsType} from '../../game-common/models/stats.model';
import characterList from '../../../assets/data/characters/character-list.json';
import statsCurvesLevel from '../../../assets/data/characters/character-stats-curve-level.json';
import {SettingService} from '../../setting/services/setting.service';
import {allGenders, Gender} from '../models/gender.enum';
import {Observable, ReplaySubject} from 'rxjs';
import {
  CharacterInfoOptions,
  defaultCharacterInfoOptions,
} from '../models/options.model';
import {first, map} from 'rxjs/operators';
import {I18n} from '../../widget/models/i18n.model';

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

  readonly infos = objectMap<CharacterInfo>(
    JSON.parse(JSON.stringify(characterList)),
  );

  private statsCurvesLevel = statsCurvesLevel as CharacterStatsCurveLevel;

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

  private options$ = new ReplaySubject<CharacterInfoOptions>(1);

  readonly options = this.options$.asObservable();

  constructor(private settings: SettingService, private logger: NGXLogger) {
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
        const curvesLevel = this.statsCurvesLevel;
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
