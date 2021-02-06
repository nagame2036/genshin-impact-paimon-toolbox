/**
 * Represents the stats info of a weapon.
 */
export type WeaponStatsInfo = Partial<Record<WeaponStatsType, WeaponStats>>;

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
 * Represent the data of a weapon stats grow curve per level.
 */
export interface WeaponStatsCurveLevel {

  [name: string]: number[];
}

/**
 * Represent the data of a weapon stats grow curve per ascension.
 */
export interface WeaponStatsCurveAscension {

  [rarity: number]: Partial<Record<WeaponStatsType, number[]>>;
}

/**
 * Cache the calculated value of specific weapon progress.
 */
export type WeaponStatsValue = Partial<Record<WeaponStatsType, number>>;

export type WeaponStatsType =
  | 'ATK Base' // Attack base
  | 'HP%' // Health Points bonus %
  | 'ATK%' // Attack bonus %
  | 'DEF%' // Defense bonus %
  | 'CHC%' // Critical Hit Chance (CRIT Rate) bonus %
  | 'CHD%' // Critical Hit Damage (CRIT DMG) bonus %
  | 'ER%' // Energy Recharge %
  | 'EM' // Element Mastery
  | 'PHY DMG%' // Physical Damage bonus %
  ;
