import {Nation} from '../nation.enum';
import {Rarity} from '../rarity.enum';
import {ItemCost} from './item-cost';
import {InventoryItem} from './inventory-item';

export interface WeaponMaterial {

  groups: WeaponMaterialGroup[];

  items: WeaponMaterialItem[];
}

export interface WeaponMaterialGroup {

  id: number;

  nation: Nation;

  source: number[];

  weekday: number[];
}

export interface WeaponMaterialItem extends InventoryItem {

  id: number;

  group: number;

  rarity: Rarity;

  craft?: ItemCost[];
}
