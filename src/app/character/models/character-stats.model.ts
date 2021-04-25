import {allResBonusStatsTypes, StatsType, StatsValue} from '../../game-common/models/stats.model';

/**
 * Represents the stats info of a character.
 */
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
    super(defaultValues);
  }
}

const defaultValues = new Map<StatsType, number>([
  ['CHC%', Math.fround(0.05)],
  ['CHD%', 0.5],
  ['ER%', 1],
  ['STA recover speed', 25],
  ...allResBonusStatsTypes.map(res => [res, Math.fround(0.15)] as [StatsType, number]),
]);
