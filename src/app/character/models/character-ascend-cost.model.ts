import {MaterialGroupCost} from '../../material/models/material-group-cost.model';

export interface CharacterAscendCost {
  mora: number;

  boss: number;

  gem: MaterialGroupCost;

  local: number;

  mob: MaterialGroupCost;
}
