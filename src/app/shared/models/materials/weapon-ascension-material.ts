import {Nation} from '../nation.enum';
import {Rarity} from '../rarity.enum';
import {CraftRecipe} from './craft-recipe';

export interface WeaponAscensionMaterialsData {

  groups: { [id: number]: WeaponAscensionMaterialGroup };

  items: { [id: number]: WeaponAscensionMaterialItem };
}

export interface WeaponAscensionMaterialGroup {

  nation: Nation;

  source: number[];

  weekday: number[];
}

export interface WeaponAscensionMaterialItem {

  group: number;

  rarity: Rarity;

  craft?: CraftRecipe[];
}
