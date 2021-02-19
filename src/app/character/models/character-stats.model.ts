/**
 * Represents the stats info of a character.
 */
import {allResBonusStatsTypes, StatsType, StatsValue} from '../../game-common/models/stats.model';

export type CharacterStatsInfo = Partial<Record<StatsType, CharacterStats>>;

/**
 * Represents the attribute info of a character stats.
 */
export interface CharacterStats {

  /**
   * The initial value of character stats.
   */
  initial: number;

  /**
   * Name of character stats value grow curve per level.
   */
  curve?: string;
}

/**
 * Represents the data of a character stats grow curve per level.
 */
export interface CharacterStatsCurveLevel {

  [name: string]: number[];
}

/**
 * Represents the data of a character stats grow curve per ascension.
 */
export type CharacterStatsCurveAscension = Partial<Record<StatsType, number[]>>;

/**
 * Cache the calculated value of specific character progress.
 */
export class CharacterStatsValue extends StatsValue {

  constructor() {
    const defaults = new Map<StatsType, number>();
    const specifics: [StatsType, number][] = [
      ['CHC%', 0.05000000074505806],
      ['CHD%', 0.5],
      ['ER%', 1.0],
      ['STA recover speed', 25.0],
    ];
    specifics.forEach(([type, value]) => defaults.set(type, value));
    allResBonusStatsTypes.forEach(res => defaults.set(res, 0.15000000596046448));
    super(defaults);
  }
}
