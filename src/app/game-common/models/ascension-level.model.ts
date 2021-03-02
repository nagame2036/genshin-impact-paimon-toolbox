import {coerceIn} from '../../shared/utils/coerce';
import {Ascension} from './ascension.type';
import {rangeList} from '../../shared/utils/range-list';

export class AscensionLevel {
  static limit = [
    {min: 1, max: 20},
    {min: 20, max: 40},
    {min: 40, max: 50},
    {min: 50, max: 60},
    {min: 60, max: 70},
    {min: 70, max: 80},
    {min: 80, max: 90},
  ];

  #level = 1;

  constructor(public ascension: Ascension = 0, level: number = 1) {
    this.level = level;
  }

  get level(): number {
    return this.#level;
  }

  set level(value: number) {
    this.#level = AscensionLevel.correctLevel(this.ascension, value);
  }

  static correctLevel(ascension: Ascension, level: number): number {
    const limit = AscensionLevel.limit[ascension];
    return coerceIn(level, limit?.min ?? 0, limit?.max ?? 0);
  }

  static levels(ascension: Ascension, start: number = -1): number[] {
    const limit = AscensionLevel.limit[ascension];
    const min = Math.max(start, limit?.min ?? start);
    return rangeList(min, limit?.max ?? start);
  }
}
