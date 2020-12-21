import {Rarity} from '../../shared/models/rarity.enum';
import {ItemCost} from './item-cost.model';
import {InventoryItem} from './inventory-item.model';

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
