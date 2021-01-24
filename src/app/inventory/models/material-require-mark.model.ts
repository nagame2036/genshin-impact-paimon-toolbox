import {ItemType} from '../../game-common/models/item-type.enum';

export interface MaterialRequireMark {

  need: number;

  type: ItemType;

  id: number;

  use: string;

  start: string;

  goal: string;
}
