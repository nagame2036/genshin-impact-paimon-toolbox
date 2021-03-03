import {MaterialGroupCost} from '../../material/models/material-group-cost.model';

export interface WeaponAscendCost {
  /**
   * Stores the cost of materials per ascension for each rarity of weapons.
   */
  [rarity: number]: WeaponRarityAscendCost[];
}

export interface WeaponRarityAscendCost {
  mora: number;

  domain: MaterialGroupCost;

  elite: MaterialGroupCost;

  mob: MaterialGroupCost;
}
