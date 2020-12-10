import {Nation} from './nation.enum';
import {Rarity} from './rarity.enum';
import {CraftRecipe} from './craft-recipe';

export interface TalentMaterialsData {

  groups: { [id: number]: TalentMaterialGroup };

  items: { [id: number]: TalentMaterialItem };
}

export interface TalentMaterialGroup {

  nation: Nation;

  source: number[];

  weekday: number[];
}

export interface TalentMaterialItem {

  group: number;

  rarity: Rarity;

  craft?: CraftRecipe[];
}
