import {InventoryItem} from './inventory-item.model';

export interface WeaponExpMaterial {

  groups: WeaponExpMaterialGroup[];

  items: WeaponExpMaterialItem[];
}

export interface WeaponExpMaterialGroup {

  id: number;
}

export interface WeaponExpMaterialItem extends InventoryItem {

  group: number;

  exp: number;
}
