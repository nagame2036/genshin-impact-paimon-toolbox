import {Rarity} from '../../shared/models/rarity.enum';

export interface InventoryData {
  items: InventoryItem[];
}

export interface InventoryItem {

  id: number;

  group?: number;

  rarity: Rarity;
}
