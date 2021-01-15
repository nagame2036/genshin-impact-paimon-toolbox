import {GroupItemCost} from './group-item-cost.model';

export interface CharacterAscensionCost {

  mora: number;

  boss: number;

  gem: GroupItemCost;

  local: number;

  mob: GroupItemCost;
}
