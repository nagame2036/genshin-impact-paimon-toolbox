import {GroupItemCost} from '../../game-common/models/group-item-cost.model';

export interface CharacterAscensionCost {

  mora: number;

  boss: number;

  gem: GroupItemCost;

  local: number;

  mob: GroupItemCost;
}
