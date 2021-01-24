import {Rarity} from '../../game-common/models/rarity.type';
import {CraftRecipe} from './craft-recipe.model';

export interface InventoryItem {

  id: number;

  group?: number;

  rarity: Rarity;

  /**
   * Material source id.
   */
  source?: number[];

  recipe?: CraftRecipe;
}
