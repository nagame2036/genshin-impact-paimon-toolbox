import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NGXLogger} from 'ngx-logger';
import {EMPTY, Observable, of, ReplaySubject} from 'rxjs';
import {TalentInfo, TalentLevel} from '../models/talent-info.model';
import {objectMap} from '../../shared/utils/collections';
import {first, map, switchMap, tap, throwIfEmpty} from 'rxjs/operators';
import {Ascension} from '../../game-common/models/ascension.type';
import {coerceIn} from '../../shared/utils/coerce';
import {rangeList} from '../../shared/utils/range-list';
import {TalentProgress} from '../models/talent-progress.model';

@Injectable({
  providedIn: 'root'
})
export class TalentInformationService {

  private readonly prefix = 'assets/data/characters';

  private talents$ = new ReplaySubject<Map<number, TalentInfo>>(1);

  constructor(http: HttpClient, private logger: NGXLogger) {
    http.get<{ [id: number]: TalentInfo }>(`${this.prefix}/talents.json`).subscribe(data => {
      const talents = objectMap(data);
      this.logger.info('loaded talent data', talents, data);
      this.talents$.next(talents);
    });
  }

  get(id: number): Observable<TalentInfo> {
    return this.talents$.pipe(
      switchMap(talents => {
        const talent = talents.get(id);
        return talent ? of(talent) : EMPTY;
      }),
      throwIfEmpty()
    );
  }

  getAll(ids: number[]): Observable<TalentInfo[]> {
    return this.talents$.pipe(
      first(),
      map(talents => {
        const results = [];
        for (const id of ids) {
          const talent = talents.get(id);
          if (talent) {
            results.push(talent);
          }
        }
        return results;
      }),
      tap(talents => this.logger.info('sent talents', ids, talents)),
    );
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

  correctLevels(levels: TalentProgress, ascension: Ascension, starts: { [id: number]: number } = {}): void {
    const max = this.maxLevel(ascension);
    for (const [idString, level] of Object.entries(levels)) {
      const id = Number(idString);
      const min = coerceIn(starts[id] ?? 1, 1, max);
      levels[id] = coerceIn(level, min, max) as TalentLevel;
    }
  }

  levels(ascension: Ascension, start: number = 1): TalentLevel[] {
    const min = Math.max(1, start);
    return rangeList(min, this.maxLevel(ascension), true) as TalentLevel[];
  }
}
