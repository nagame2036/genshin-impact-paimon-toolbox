import {Rarity} from '../../shared/models/rarity.enum';

export interface InventoryData {
  items: { [id: number]: { group?: number, rarity?: Rarity } };
}

export interface InventoryItem {

  id: number;

  rarity: Rarity;
}
