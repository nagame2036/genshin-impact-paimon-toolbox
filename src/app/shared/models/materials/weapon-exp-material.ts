import {Rarity} from '../rarity.enum';
import {ItemCost} from './item-cost';

export interface WeaponExpMaterial {

  groups: WeaponExpMaterialGroup[];

  items: WeaponExpMaterialItem[];
}

export interface WeaponExpMaterialGroup {

  id: number;
}

export interface WeaponExpMaterialItem {

  id: number;

  rarity: Rarity;

  exp: number;

  craft: ItemCost[];
}
