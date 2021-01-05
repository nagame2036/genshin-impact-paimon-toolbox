import {Nation} from '../../shared/models/nation.enum';
import {InventoryItem} from './inventory-item.model';

export interface WeaponMaterial {

  groups: WeaponMaterialGroup[];

  items: WeaponMaterialItem[];
}

export interface WeaponMaterialGroup {

  id: number;

  nation: Nation;

  source: number[];

  weekday: number;
}

export interface WeaponMaterialItem extends InventoryItem {

  group: number;
}
