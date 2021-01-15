import {InventoryItem} from './inventory-item.model';

export interface EnemiesMaterial {

  groups: EnemiesMaterialGroup[];

  items: EnemiesMaterialItem[];
}

export interface EnemiesMaterialGroup {

  id: number;
}

export interface EnemiesMaterialItem extends InventoryItem {

  group: number;
}
