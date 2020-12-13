import {Nation} from '../nation.enum';
import {Rarity} from '../rarity.enum';
import {ItemCost} from './item-cost';

export interface WeaponMaterialsData {

  groups: WeaponMaterialGroup[];

  items: WeaponMaterialItem[];
}

export interface WeaponMaterialGroup {

  id: number;

  nation: Nation;

  source: number[];

  weekday: number[];
}

export interface WeaponMaterialItem {

  id: number;

  group: number;

  rarity: Rarity;

  craft?: ItemCost[];
}
