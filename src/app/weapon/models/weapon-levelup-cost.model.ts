export interface WeaponLevelupCost {
  /**
   * Stores the cost of exp per level for each rarity of weapons.
   */
  [rarity: number]: number[];
}
