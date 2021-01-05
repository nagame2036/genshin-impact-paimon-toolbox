import {Rarity} from '../../shared/models/rarity.enum';
import {CraftRecipe} from './craft-recipe.model';

export interface InventoryItem {

  id: number;

  group?: number;

  rarity: Rarity;

  recipe?: CraftRecipe;
}
