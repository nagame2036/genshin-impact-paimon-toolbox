import {Rarity} from '../../game-common/models/rarity.type';

export interface MaterialInfo {

  id: number;

  group?: number;

  rarity: Rarity;

  /**
   * Material source id.
   */
  source?: number[];

  recipes?: CraftRecipe[];
}

export class MaterialDetail {

  id: number;

  rarity: Rarity;

  need = 0;

  have = 0;

  recipes?: CraftRecipe[];

  craftable = false;

  lack = 0;

  overflow = true;

  readonly = false;

  constructor({id, rarity, recipes}: MaterialInfo) {
    this.id = id;
    this.rarity = rarity;
    this.recipes = recipes;
  }
}

export interface CraftRecipe {

  /**
   * Item id to amount.
   */
  [id: number]: number;
}
