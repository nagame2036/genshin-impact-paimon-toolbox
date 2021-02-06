import {Rarity} from '../../game-common/models/rarity.type';

export interface MaterialInfo {

  id: number;

  group?: number;

  rarity: Rarity;

  /**
   * Material source id.
   */
  source?: number[];

  recipe?: CraftRecipe;
}

export class MaterialDetail {

  id: number;

  rarity: Rarity;

  need = 0;

  have = 0;

  recipe?: CraftRecipe;

  craftable = 0;

  craftUsed = 0;

  lack = 0;

  overflow = true;

  readonly = false;

  constructor({id, rarity, recipe}: MaterialInfo) {
    this.id = id;
    this.rarity = rarity;
    this.recipe = recipe;
  }
}

export interface CraftRecipe {

  /**
   * Item id to amount.
   */
  [id: number]: number;
}
