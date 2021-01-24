import {GroupItemCost} from '../../game-common/models/group-item-cost.model';

export interface WeaponAscensionCost {

  /**
   * Stores the cost of materials per ascension for each rarity of weapons.
   */
  [rarity: number]: WeaponRarityAscensionCost[];
}

export interface WeaponRarityAscensionCost {

  mora: number;

  domain: GroupItemCost;

  elite: GroupItemCost;

  mob: GroupItemCost;
}
