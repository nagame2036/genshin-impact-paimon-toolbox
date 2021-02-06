import {MaterialGroupCost} from '../../material/models/material-group-cost.model';

export interface CharacterAscensionCost {

  mora: number;

  boss: number;

  gem: MaterialGroupCost;

  local: number;

  mob: MaterialGroupCost;
}
