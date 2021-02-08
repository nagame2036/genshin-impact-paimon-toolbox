/**
 * Represents the stats info of a character.
 */
export type CharacterStatsInfo = Partial<Record<CharacterStatsType, CharacterStats>>;

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
 * Represent the data of a character stats grow curve per level.
 */
export interface CharacterStatsCurveLevel {

  [name: string]: number[];
}

/**
 * Represent the data of a character stats grow curve per ascension.
 */
export type CharacterStatsCurveAscension = Partial<Record<CharacterStatsType, number[]>>;

/**
 * Cache the calculated value of specific character progress.
 */
export type CharacterStatsValue = Partial<Record<CharacterStatsType, number>>;

export type CharacterStatsType =
  | 'HP' // Max Health Points final
  | 'HP Base' // Health Points base
  | 'HP%' // Health Points bonus %
  | 'ATK' // Attack final
  | 'ATK Base' // Attack base
  | 'ATK%' // Attack bonus %
  | 'DEF' // Defense final
  | 'DEF Base' // Defense base
  | 'DEF%' // Defense bonus %
  | 'CHC%' // Critical Hit Chance (CRIT Rate) bonus %
  | 'CHD%' // Critical Hit Damage (CRIT DMG) bonus %
  | 'ER%' // Energy Recharge %
  | 'EM' // Element Mastery
  | 'Healing%' // Healing bonus %
  | 'Incoming Healing%' // Incoming Healing bonus %
  | 'Shield STR%' // Shield Strength bonus %
  | 'Anemo DMG%' // Anemo Damage bonus %
  | 'Anemo RES%' // Anemo Resistance bonus %
  | 'Geo DMG%' // Geo Damage bonus %
  | 'Geo RES%' // Geo Resistance bonus %
  | 'Electro DMG%' // Electro Damage bonus %
  | 'Electro RES%' // Electro Resistance bonus %
  | 'Dendro DMG%' // Dendro Damage bonus %
  | 'Dendro RES%' // Dendro Resistance bonus %
  | 'Hydro DMG%' // Hydro Damage bonus %
  | 'Hydro RES%' // Hydro Resistance bonus %
  | 'Pyro DMG%' // Pyro Damage bonus %
  | 'Pyro RES%' // Pyro Resistance bonus %
  | 'Cryo DMG%' // Cryo Damage bonus %
  | 'Cryo RES%' // Cryo Resistance bonus %
  | 'PHY DMG%' // Physical Damage bonus %
  | 'PHY RES%' // Physical Resistance bonus %
  ;
