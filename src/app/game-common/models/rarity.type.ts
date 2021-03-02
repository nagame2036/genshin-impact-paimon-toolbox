export const allRarities = [5, 4, 3, 2, 1] as const;

/**
 * Represents the rarity of item.
 */
export type Rarity = typeof allRarities[number];
