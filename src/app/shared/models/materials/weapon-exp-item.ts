import {Rarity} from '../rarity.enum';
import {CraftRecipe} from './craft-recipe';

export interface WeaponExpItemsData {

  groups: { [id: number]: WeaponExpGroup };

  items: { [id: number]: WeaponExpItem };
}

// tslint:disable-next-line:no-empty-interface
export interface WeaponExpGroup {
}

export interface WeaponExpItem {

  rarity: Rarity;

  exp: number;

  craft: CraftRecipe[];
}
