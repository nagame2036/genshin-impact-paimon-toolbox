import {Rarity} from '../rarity.enum';
import {ItemCost} from './item-cost';
import {InventoryItem} from './inventory-item';

export interface WeaponExpMaterial {

  groups: WeaponExpMaterialGroup[];

  items: WeaponExpMaterialItem[];
}

export interface WeaponExpMaterialGroup {

  id: number;
}

export interface WeaponExpMaterialItem extends InventoryItem {

  id: number;

  group: number;

  rarity: Rarity;

  exp: number;

  craft: ItemCost[];
}
