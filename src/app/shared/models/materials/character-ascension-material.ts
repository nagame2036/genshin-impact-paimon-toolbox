import {Rarity} from '../rarity.enum';
import {CraftRecipe} from './craft-recipe';
import {ElementType} from '../element-type.enum';

export interface CharacterAscensionMaterialsData {

  groups: { [id: number]: CharacterAscensionMaterialGroup };

  items: { [id: number]: CharacterAscensionMaterialItem };
}

export interface CharacterAscensionMaterialGroup {

  element: ElementType;

  source: number[];
}

export interface CharacterAscensionMaterialItem {

  group: number;

  rarity: Rarity;

  craft?: CraftRecipe[];
}
