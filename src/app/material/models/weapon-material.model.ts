import {Nation} from '../../shared/models/nation.enum';
import {Rarity} from '../../shared/models/rarity.enum';
import {ItemCost} from './item-cost.model';
import {InventoryItem} from './inventory-item.model';

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
