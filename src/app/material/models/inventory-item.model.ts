import {Rarity} from '../../shared/models/rarity.type';
import {CraftRecipe} from './craft-recipe.model';

export interface InventoryItem {

  id: number;

  group?: number;

  rarity: Rarity;

  recipe?: CraftRecipe;
}
