import {Rarity} from '../rarity.enum';
import {ItemCost} from './item-cost';
import {ElementType} from '../element-type.enum';

export interface ElementalMaterialsData {

  groups: ElementalMaterialGroup[];

  items: ElementalMaterialItem[];
}

export interface ElementalMaterialGroup {

  id: number;

  element: ElementType;

  source: number[];
}

export interface ElementalMaterialItem {

  id: number;

  group: number;

  rarity: Rarity;

  craft?: ItemCost[];
}
