import {InventoryItem} from './inventory-item';

export interface OreMaterial {

  groups: OreMaterialGroup[];

  items: OreMaterialItem[];
}

export interface OreMaterialGroup {

  id: number;
}

export interface OreMaterialItem extends InventoryItem {

  id: number;

  group: number;
}
