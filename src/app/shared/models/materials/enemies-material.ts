import {Rarity} from '../rarity.enum';
import {CraftRecipe} from './craft-recipe';

export interface EnemiesMaterialsData {

  groups: { [id: number]: EnemiesMaterialGroup };

  items: { [id: number]: EnemiesMaterialItem };
}

export interface EnemiesMaterialGroup {

  source: number[];
}

export interface EnemiesMaterialItem {

  group: number;

  rarity: Rarity;

  craft?: CraftRecipe[];
}
