import {Nation} from '../nation.enum';
import {Rarity} from '../rarity.enum';
import {CraftRecipe} from './craft-recipe';

export interface WeaponMaterialsData {

  groups: { [id: number]: WeaponMaterialGroup };

  items: { [id: number]: WeaponMaterialItem };
}

export interface WeaponMaterialGroup {

  nation: Nation;

  source: number[];

  weekday: number[];
}

export interface WeaponMaterialItem {

  group: number;

  rarity: Rarity;

  craft?: CraftRecipe[];
}
