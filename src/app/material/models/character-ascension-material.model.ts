import {InventoryItem} from './inventory-item.model';

export interface CharacterAscensionMaterial {

  groups: CharacterAscensionMaterialGroup[];

  items: CharacterAscensionMaterialItem[];
}

export interface CharacterAscensionMaterialGroup {

  id: number;
}

export interface CharacterAscensionMaterialItem extends InventoryItem {

  group: number;
}
