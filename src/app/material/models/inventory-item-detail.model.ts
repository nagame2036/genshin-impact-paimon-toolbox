import {Rarity} from '../../shared/models/rarity.type';
import {CraftRecipe} from './craft-recipe.model';

export interface InventoryItemDetail {

  id: number;

  rarity: Rarity;

  need: number;

  have: number;

  recipe?: CraftRecipe;

  craftable: number;

  craftUsed: number;

  lack: number;

  overflow: boolean;

  readonly: boolean;
}
