import {ItemType} from '../../game-common/models/item-type.enum';
import {MaterialList} from '../collections/material-list';

export type MaterialRequireMark = RequireMark & { need: number };

export interface RequireMark {

  type: ItemType;

  id: number;

  /**
   * Used to identify if it is the same item.
   */
  key: number;

  purposeType: string;

  purpose: string;

  start: string;

  goal: string;
}

export interface RequireMarkDetail {

  mark: RequireMark;

  requirement: MaterialList;
}
