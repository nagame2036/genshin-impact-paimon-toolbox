export const allDmgBonusStatsTypes = [
  'Anemo DMG%', // Anemo Damage bonus %
  'Geo DMG%', // Geo Damage bonus %
  'Electro DMG%', // Electro Damage bonus %
  'Dendro DMG%', // Dendro Damage bonus %
  'Hydro DMG%', // Hydro Damage bonus %
  'Pyro DMG%', // Pyro Damage bonus %
  'Cryo DMG%', // Cryo Damage bonus %
  'PHY DMG%', // Physical Damage bonus %
] as const;

export const allResBonusStatsTypes = [
  'Anemo RES%', // Anemo Resistance bonus %
  'Geo RES%', // Geo Resistance bonus %
  'Electro RES%', // Electro Resistance bonus %
  'Dendro RES%', // Dendro Resistance bonus %
  'Hydro RES%', // Hydro Resistance bonus %
  'Pyro RES%', // Pyro Resistance bonus %
  'Cryo RES%', // Cryo Resistance bonus %
  'PHY RES%', // Physical Resistance bonus %
] as const;

export const allStatsTypes = [
  'HP', // Max Health Points final
  'HP Base', // Health Points base
  'HP%', // Health Points bonus %
  'HP Flat', // Health Points Flat
  'ATK', // Attack final
  'ATK Base', // Attack base
  'ATK%', // Attack bonus %
  'ATK Flat', // Attack Flat
  'DEF', // Defense final
  'DEF Base', // Defense base
  'DEF%', // Defense bonus %
  'DEF Flat', // Defense Flat
  'CHC%', // Critical Hit Chance (CRIT Rate) bonus %
  'CHD%', // Critical Hit Damage (CRIT DMG) bonus %
  'ER%', // Energy Recharge %
  'EM', // Element Mastery
  'Healing%', // Healing bonus %
  'Incoming Healing%', // Incoming Healing bonus %
  'Shield STR%', // Shield Strength bonus %
  'STA recover speed', // Stamina recover speed
  ...allDmgBonusStatsTypes,
  ...allResBonusStatsTypes,
] as const;

export type StatsType = (typeof allStatsTypes)[number];

export abstract class StatsValue {

  private values = new Map<StatsType, number>();

  protected constructor(private defaults: Map<StatsType, number> = new Map()) {
  }

  get(type: StatsType): number {
    return this.values.get(type) ?? this.defaults.get(type) ?? 0;
  }

  getTypes(): StatsType[] {
    return [...this.values.keys()];
  }

  add(type: StatsType, value: number): void {
    this.values.set(type, value + this.get(type));
  }
}
