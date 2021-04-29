import {Injectable} from '@angular/core';
import {TalentInfo, TalentLevel, UpgradableTalentInfo} from '../models/talent-info.model';
import {unionMap} from '../../shared/utils/collections';
import {Ascension} from '../../game-common/models/ascension.type';
import {coerceIn} from '../../shared/utils/coerce';
import {rangeList} from '../../shared/utils/range-list';
import {TalentProgress} from '../models/talent-progress.model';
import talentList from '../../../data/character/talent-list.json';
import {load, objectMap} from '../../shared/utils/json';
import {CharacterInfo} from '../models/character-info.model';
import {SelectOption} from '../../widget/models/select-option.model';

type Talent = {talents: TalentProgress};

type TalentAscension = Talent & {ascension: Ascension};

@Injectable({
  providedIn: 'root',
})
export class TalentInfoService {
  readonly infos = objectMap<TalentInfo>(load(talentList));

  readonly sameLevels = unionMap([
    [10010, 10110],
    [10020, 10120],
  ]);

  constructor() {}

  getUpgradableInfos(info: CharacterInfo): UpgradableTalentInfo[] {
    return info.talents
      .map(id => this.infos.get(id))
      .filter((it): it is UpgradableTalentInfo => !!it && 'materials' in it);
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

  levels(ascension: Ascension, start: number = 1): SelectOption[] {
    const min = Math.max(1, start) as TalentLevel;
    return rangeList(min, this.maxLevel(ascension)).map(it => ({value: it, text: `${it}`}));
  }

  copyProgress({talents: curr}: Talent, {talents: plan}: Talent): void {
    for (const idStr of Object.keys(curr)) {
      const id = Number(idStr);
      const sameLevels = this.sameLevels.get(id) ?? [id];
      sameLevels.filter(it => plan[it]).forEach(it => (curr[id] = plan[it]));
    }
  }

  correctLevel(ascension: Ascension, level: number): TalentLevel {
    const max = this.maxLevel(ascension);
    return coerceIn(level, 1, max) as TalentLevel;
  }

  correctLevels({ascension, talents}: TalentAscension, starts: TalentProgress = {}): void {
    const max = this.maxLevel(ascension);
    for (const [idString, level] of Object.entries(talents)) {
      const id = Number(idString);
      const min = coerceIn(starts[id] ?? 1, 1, max);
      talents[id] = coerceIn(level, min, max) as TalentLevel;
    }
  }
}
