import {InventoryItem} from './inventory-item.model';

export interface CharacterExpMaterial {

  groups: CharacterExpMaterialGroup[];

  items: CharacterExpMaterialItem[];
}

export interface CharacterExpMaterialGroup {

  id: number;
}

export interface CharacterExpMaterialItem extends InventoryItem {

  group: number;

  exp: number;
}
