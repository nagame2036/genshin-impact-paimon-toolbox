import {Rarity} from '../rarity.enum';
import {CraftRecipe} from './craft-recipe';
import {ElementType} from '../element-type.enum';

export interface ElementalMaterialsData {

  groups: { [id: number]: ElementalMaterialGroup };

  items: { [id: number]: ElementalMaterialItem };
}

export interface ElementalMaterialGroup {

  element: ElementType;

  source: number[];
}

export interface ElementalMaterialItem {

  group: number;

  rarity: Rarity;

  craft?: CraftRecipe[];
}
