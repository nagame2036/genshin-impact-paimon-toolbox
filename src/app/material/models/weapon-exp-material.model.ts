import {Rarity} from '../../shared/models/rarity.enum';
import {ItemAmount} from './item-amount.model';
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

  craft: ItemAmount[];
}
