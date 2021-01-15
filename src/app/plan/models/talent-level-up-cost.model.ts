import {GroupItemCost} from './group-item-cost.model';

export interface TalentLevelupCost {

  mora: number;

  domain: GroupItemCost;

  mob: GroupItemCost;

  boss?: number;

  event?: number;
}
