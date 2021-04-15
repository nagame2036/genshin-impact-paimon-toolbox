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

const defaultRES = 0.15000000596046448;

const defaultCHC = 0.05000000074505806;

const defaultCHD = 0.5;

const defaultER = 1.0;

const defaultSTARecoverSpeed = 25.0;

const defaultValues = new Map<StatsType, number>([
  ['CHC%', defaultCHC],
  ['CHD%', defaultCHD],
  ['ER%', defaultER],
  ['STA recover speed', defaultSTARecoverSpeed],
  ...allResBonusStatsTypes.map(res => [res, defaultRES] as [StatsType, number]),
]);
