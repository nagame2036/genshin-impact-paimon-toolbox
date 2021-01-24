import {Nation} from '../../game-common/models/nation.enum';
import {InventoryItem} from './inventory-item.model';

export interface WeaponAscensionMaterial {

  groups: WeaponAscensionMaterialGroup[];

  items: WeaponAscensionMaterialItem[];
}

export interface WeaponAscensionMaterialGroup {

  id: number;

  nation: Nation;

  weekday: number;
}

export interface WeaponAscensionMaterialItem extends InventoryItem {

  group: number;
}
