import {ItemType} from '../../game-common/models/item-type.enum';

export interface MaterialRequireMark {

  type: ItemType;

  id: number;

  /**
   * Used to identify if it is the same item.
   */
  key: number;

  /**
   * The Map of purpose to its mark detail.
   */
  details: Map<string, MaterialRequireMarkDetail>;
}

export interface MaterialRequireMarkDetail {

  purpose: string;

  start: string;

  goal: string;

  need: number;
}

/**
 * Used as temporary variable type.
 */
export type MaterialRequireMarkTemp = Omit<MaterialRequireMark & MaterialRequireMarkDetail, 'details' | 'need'>;
