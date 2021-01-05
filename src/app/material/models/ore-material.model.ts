import {InventoryItem} from './inventory-item.model';

export interface OreMaterial {

  groups: OreMaterialGroup[];

  items: OreMaterialItem[];
}

export interface OreMaterialGroup {

  id: number;
}

export interface OreMaterialItem extends InventoryItem {

  group: number;
}
