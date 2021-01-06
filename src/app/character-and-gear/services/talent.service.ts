import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {TalentData, TalentDataGroup, TalentDataItem} from '../models/talent.model';
import {HttpClient} from '@angular/common/http';
import {Ascension} from '../models/ascension.enum';
import {TalentLevel} from '../models/talent-level.type';
import {rangeList} from '../../shared/utils/range-list';
import {coerceIn} from '../../shared/utils/coerce';
import {TalentLevelData} from '../models/talent-level-data.model';

@Injectable({
  providedIn: 'root'
})
export class TalentService {

  #groups: TalentDataGroup[] = [];

  private groupsSubject = new ReplaySubject<TalentDataGroup[]>(1);

  readonly groups = this.groupsSubject.asObservable();

  #talents: TalentDataItem[] = [];

  private talentsSubject = new ReplaySubject<TalentDataItem[]>(1);

  readonly talents = this.talentsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.http.get<TalentData>('assets/data/talents.json').subscribe(res => {
      const {groups: groups, items: items} = res;
      this.#groups = groups;
      this.groupsSubject.next(groups);
      this.#talents = items;
      this.talentsSubject.next(items);
    });
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

  correctLevel(ascension: Ascension, level: number): TalentLevel {
    const max = this.maxLevel(ascension);
    return coerceIn(level, 1, max) as TalentLevel;
  }

  correctLevels(ascension: Ascension, levels: TalentLevelData[], starts: number[] = [1, 1, 1]): TalentLevelData[] {
    const max = this.maxLevel(ascension);
    return levels.map((it, index) => {
      const min = Math.min(1, starts[index]);
      const level = coerceIn(it.level, min, max) as TalentLevel;
      return {id: it.id, level};
    });
  }

  levels(ascension: Ascension, start: number = 1): TalentLevel[] {
    const min = Math.max(1, start);
    return rangeList(min, this.maxLevel(ascension), true) as TalentLevel[];
  }

  getTalentsOfCharacter(id: number): TalentDataItem[] {
    return this.#talents.filter(it => it.character === id);
  }

  getGroupById(id: number): TalentDataGroup | undefined {
    const talent = this.#talents.find(it => it.id === id);
    if (talent) {
      return this.#groups.find(it => it.id === talent.group);
    }
    return undefined;
  }
}
