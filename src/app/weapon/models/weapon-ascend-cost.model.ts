import {MaterialGroupCost} from '../../material/models/material-group-cost.model';
import {Rarity} from '../../game-common/models/rarity.type';

/**
 * Stores the cost of materials per ascension for each rarity of weapons.
 */
export type WeaponAscendCost = Partial<Record<Rarity, WeaponRarityAscendCost[]>>;

interface WeaponRarityAscendCost {
  mora: number;

  domain: MaterialGroupCost;

  elite: MaterialGroupCost;

  mob: MaterialGroupCost;
}
