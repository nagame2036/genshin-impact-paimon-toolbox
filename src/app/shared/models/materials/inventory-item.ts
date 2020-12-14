import {Rarity} from '../rarity.enum';

export interface InventoryItem {

  id: number;

  group?: number;

  rarity: Rarity;
}
