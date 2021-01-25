import {ItemType} from '../../game-common/models/item-type.enum';

export interface MaterialRequireMark {

  type: ItemType;

  id: number;

  /**
   * Used to identify if it is the same item.
   */
  key: number;

  details: MaterialRequireMarkDetail[];
}

export interface MaterialRequireMarkDetail {

  purpose: string;

  start: string;

  goal: string;

  need: number;
}
