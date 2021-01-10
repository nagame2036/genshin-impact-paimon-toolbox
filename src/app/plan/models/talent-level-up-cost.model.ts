import {GroupItemCost} from './group-item-cost.model';

export interface TalentLevelupCost {

  mora: number;

  domain: GroupItemCost;

  common: GroupItemCost;

  boss?: number;

  event?: number;
}
