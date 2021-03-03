import {Injectable} from '@angular/core';
import {CharacterInfo} from '../models/character-info.model';
import {NGXLogger} from 'ngx-logger';
import {objectMap} from '../../shared/utils/collections';
import {
  CharacterStatsCurveLevel,
  CharacterStatsValue,
} from '../models/character-stats.model';
import {Ascension} from '../../game-common/models/ascension.type';
import {Character, CharacterOverview} from '../models/character.model';
import {StatsType} from '../../game-common/models/stats.model';
import characterList from '../../../assets/data/characters/character-list.json';
import statsCurvesLevel from '../../../assets/data/characters/character-stats-curve-level.json';

/**
 * Represents the dependency of character stats value.
 */
type CharacterStatsDependency = {ascension: Ascension; level: number};

@Injectable({
  providedIn: 'root',
})
export class CharacterInfoService {
  readonly infos = objectMap<CharacterInfo>(
    JSON.parse(JSON.stringify(characterList)),
  );

  private readonly statsCurvesLevel = statsCurvesLevel as CharacterStatsCurveLevel;

  constructor(private logger: NGXLogger) {}

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
}
