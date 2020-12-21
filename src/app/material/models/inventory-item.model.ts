import {Rarity} from '../../shared/models/rarity.enum';

export interface InventoryItem {

  id: number;

  group?: number;

  rarity: Rarity;
}
