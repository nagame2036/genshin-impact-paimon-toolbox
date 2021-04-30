import {Injectable} from '@angular/core';
import {allAscensions, Ascension} from '../models/ascension.type';
import {coerceRange} from '../../shared/utils/coerce';
import {AscensionLevel, AscensionLevelData} from '../models/ascension-level.model';

@Injectable({
  providedIn: 'root',
})
export class AscensionLevelService {
  private ascensionRange: [Ascension, Ascension] = [
    0 as Ascension,
    allAscensions[allAscensions.length - 1],
  ];

  private levelRanges: [number, number][] = [
    [1, 20],
    [20, 40],
    [40, 50],
    [50, 60],
    [60, 70],
    [70, 80],
    [80, 90],
  ];

  constructor() {}

  format({ascension, level}: AscensionLevel): string {
    const ascended = ascension > 0 && level === this.levelRanges[ascension][0];
    return ascended ? `${level}+` : `${level}`;
  }

  less(left: AscensionLevel, right: AscensionLevel): boolean {
    return left.ascension < right.ascension || left.level < right.level;
  }

  correct(curr: AscensionLevel, start?: AscensionLevel): AscensionLevelData {
    const ascensionRange = [...this.ascensionRange] as [Ascension, Ascension];
    if (start) {
      ascensionRange[0] = start.ascension;
    }
    const ascension = coerceRange(curr.ascension, ascensionRange);
    const levelRange = [...this.levelRanges[ascension]] as [number, number];
    if (start) {
      levelRange[0] = Math.max(start.level, levelRange[0]);
    }
    const level = coerceRange(curr.level, levelRange);
    return {ascensionRange, ascension, levelRange, level};
  }
}
