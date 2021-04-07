import {Rarity} from '../../game-common/models/rarity.type';

/**
 * Stores the cost of exp per level for each rarity of weapons.
 */
export type WeaponLevelupCost = Partial<Record<Rarity, number[]>>;
