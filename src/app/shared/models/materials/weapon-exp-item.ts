import {Rarity} from '../rarity.enum';
import {ItemCost} from './item-cost';

export interface WeaponExpItemsData {

  groups: WeaponExpGroup[];

  items: WeaponExpItem[];
}

export interface WeaponExpGroup {

  id: number;
}

export interface WeaponExpItem {

  id: number;

  rarity: Rarity;

  exp: number;

  craft: ItemCost[];
}
