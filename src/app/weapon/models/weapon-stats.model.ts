import {StatsType, StatsValue} from '../../game-common/models/stats.model';

/**
 * Represents the stats info of a weapon.
 */
export type WeaponStatsInfo = Partial<Record<StatsType, WeaponStats>>;

/**
 * Represents the attribute info of a weapon stats.
 */
export interface WeaponStats {
  /**
   * The initial value of weapon stats.
   */
  initial: number;

  /**
   * Name of weapon stats value grow curve per level.
   */
  curve: string;
}

/**
 * Represents the data of a weapon stats grow curve per level.
 */
export interface WeaponStatsCurveLevel {
  [name: string]: number[];
}

/**
 * Represents the data of a weapon stats grow curve per ascension.
 */
export interface WeaponStatsCurveAscension {
  [rarity: number]: Partial<Record<StatsType, number[]>>;
}

/**
 * Cache the calculated value of specific weapon progress.
 */
export class WeaponStatsValue extends StatsValue {
  constructor() {
    super(defaultValues);
  }
}

const defaultValues = new Map<StatsType, number>();
