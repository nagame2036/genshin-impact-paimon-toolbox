import {coerceIn} from '../utils/coerce';
import {Ascension} from './ascension.enum';

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

  constructor(public ascension: Ascension = Ascension.ZERO, level: number = 1) {
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
    return coerceIn(level, limit.min, limit.max);
  }

  copyFrom(that: AscensionLevel): void {
    this.ascension = that.ascension;
    this.level = that.level;
  }
}
