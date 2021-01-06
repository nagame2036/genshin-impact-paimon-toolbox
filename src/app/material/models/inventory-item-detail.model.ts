import {Rarity} from '../../shared/models/rarity.enum';
import {CraftRecipe} from './craft-recipe.model';

export interface InventoryItemDetail {

  id: number;

  rarity: Rarity;

  need: number;

  have: number;

  recipe?: CraftRecipe;

  crafted: number;

  lack: number;

  overflow: boolean;

  readonly: boolean;
}
