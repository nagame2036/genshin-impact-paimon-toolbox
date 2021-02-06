import {MaterialGroupCost} from '../../material/models/material-group-cost.model';

export interface WeaponAscensionCost {

  /**
   * Stores the cost of materials per ascension for each rarity of weapons.
   */
  [rarity: number]: WeaponRarityAscensionCost[];
}

export interface WeaponRarityAscensionCost {

  mora: number;

  domain: MaterialGroupCost;

  elite: MaterialGroupCost;

  mob: MaterialGroupCost;
}
