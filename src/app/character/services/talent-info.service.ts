import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {TalentInfo, TalentLevel} from '../models/talent-info.model';
import {unionMap} from '../../shared/utils/collections';
import {Ascension} from '../../game-common/models/ascension.type';
import {coerceIn} from '../../shared/utils/coerce';
import {rangeList} from '../../shared/utils/range-list';
import {TalentProgress} from '../models/talent-progress.model';
import talentList from '../../../assets/data/characters/talent-list.json';
import {load, objectMap} from '../../shared/utils/json';

@Injectable({
  providedIn: 'root',
})
export class TalentInfoService {
  readonly talents = objectMap<TalentInfo>(load(talentList));

  readonly sameLevels = unionMap([
    [10010, 10110],
    [10020, 10120],
  ]);

  constructor(private logger: NGXLogger) {}

  getAll(ids: number[]): TalentInfo[] {
    const results = [];
    for (const id of ids) {
      const talent = this.talents.get(id);
      if (talent) {
        results.push(talent);
      }
    }
    this.logger.info('sent talents', ids, results);
    return results;
  }

  /**
   * Returns the max available level of talent at specific ascension phase.
   *
   * The max available level of talent is 1 in Ascension 0 and 1, 2 in Ascension 2, 4 in Ascension 3,
   * 6 in Ascension 4, 8 in Ascension 5, 10 in Ascension 6.
   *
   * @param ascension ascension phase of character
   */
  maxLevel(ascension: Ascension): TalentLevel {
    return (ascension < 2 ? 1 : (ascension - 1) * 2) as TalentLevel;
  }

  levels(ascension: Ascension, start: number = 1): TalentLevel[] {
    const min = Math.max(1, start) as TalentLevel;
    return rangeList(min, this.maxLevel(ascension));
  }

  copyProgress(source: TalentProgress, target: TalentProgress): void {
    for (const idStr of Object.keys(source)) {
      const id = Number(idStr);
      const sameLevels = this.sameLevels.get(id) ?? [id];
      for (const sameId of sameLevels) {
        if (target.hasOwnProperty(sameId)) {
          source[id] = target[sameId];
        }
      }
    }
  }

  correctLevel(ascension: Ascension, level: number): TalentLevel {
    const max = this.maxLevel(ascension);
    return coerceIn(level, 1, max) as TalentLevel;
  }

  correctLevels(
    levels: TalentProgress,
    ascension: Ascension,
    starts: TalentProgress = {},
  ): void {
    const max = this.maxLevel(ascension);
    for (const [idString, level] of Object.entries(levels)) {
      const id = Number(idString);
      const min = coerceIn(starts[id] ?? 1, 1, max);
      levels[id] = coerceIn(level, min, max) as TalentLevel;
    }
  }
}
