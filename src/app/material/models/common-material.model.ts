import {InventoryItem} from './inventory-item.model';

export interface CommonMaterial {

  groups: CommonMaterialGroup[];

  items: CommonMaterialItem[];
}

export interface CommonMaterialGroup {

  id: number;

  source: number[];
}

export interface CommonMaterialItem extends InventoryItem {

  group: number;
}
