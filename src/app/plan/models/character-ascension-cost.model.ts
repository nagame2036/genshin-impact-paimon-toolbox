import {GroupItemCost} from './group-item-cost.model';

export interface CharacterAscensionCost {

  mora: number;

  elemental: number;

  gem: GroupItemCost;

  local: number;

  enemy: GroupItemCost;
}
