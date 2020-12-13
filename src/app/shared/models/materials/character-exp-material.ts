import {Rarity} from '../rarity.enum';
import {InventoryItem} from './inventory-item';

export interface CharacterExpMaterial {

  groups: CharacterExpMaterialGroup[];

  items: CharacterExpMaterialItem[];
}

export interface CharacterExpMaterialGroup {

  id: number;
}

export interface CharacterExpMaterialItem extends InventoryItem {

  id: number;

  group: number;

  rarity: Rarity;

  exp: number;
}
