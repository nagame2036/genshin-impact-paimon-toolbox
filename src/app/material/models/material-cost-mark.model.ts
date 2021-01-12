import {ItemType} from '../../character-and-gear/models/item-type.enum';

export interface MaterialCostMark {

  need: number;

  type: ItemType;

  id: number;

  use: string;

  start: string;

  goal: string;
}
