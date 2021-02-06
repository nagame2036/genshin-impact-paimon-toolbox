import {MaterialGroupCost} from '../../material/models/material-group-cost.model';

export interface TalentLevelupCost {

  mora: number;

  domain: MaterialGroupCost;

  mob: MaterialGroupCost;

  boss?: number;

  event?: number;
}
