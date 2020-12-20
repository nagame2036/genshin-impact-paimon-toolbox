import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {TalentData, TalentDataGroup, TalentDataItem} from '../models/talent.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Ascension} from '../models/ascension.enum';
import {TalentLevel} from '../models/talent-level';
import {rangeList} from '../utils/range-list';
import {coerceIn} from '../utils/coerce';

@Injectable({
  providedIn: 'root'
})
export class TalentService {

  #groups = new ReplaySubject<TalentDataGroup[]>(1);

  readonly groups = this.#groups.asObservable();

  #talents = new ReplaySubject<TalentDataItem[]>(1);

  readonly talents = this.#talents.asObservable();

  constructor(private http: HttpClient) {
    this.http.get<TalentData>('assets/data/talents.json').subscribe(res => {
      this.#groups.next(res.groups);
      this.#talents.next(res.items);
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
  maxAvailableTalentLevel(ascension: Ascension): TalentLevel {
    return (ascension < 2 ? 1 : (ascension - 1) * 2) as TalentLevel;
  }

  correctTalentLevel(level: TalentLevel, ascension: Ascension): TalentLevel {
    const max = this.maxAvailableTalentLevel(ascension);
    return coerceIn(level, 1, max) as TalentLevel;
  }

  availableTalentLevels(ascension: Ascension): TalentLevel[] {
    return rangeList(1, this.maxAvailableTalentLevel(ascension)) as TalentLevel[];
  }

  getTalentsOfCharacter(id: number): Observable<TalentDataItem[]> {
    return this.talents.pipe(map(it => it.filter(t => t.character === id)));
  }
}
