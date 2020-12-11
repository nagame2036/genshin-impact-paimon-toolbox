import {Rarity} from '../rarity.enum';
import {CraftRecipe} from './craft-recipe';

export interface WeaponExpItemsData {

  [id: number]: WeaponExpItem;
}

export interface WeaponExpItem {

  rarity: Rarity;

  exp: number;

  craft: CraftRecipe[];
}
