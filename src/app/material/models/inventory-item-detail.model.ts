import {Rarity} from '../../shared/models/rarity.enum';

export interface InventoryItemDetail {

  id: number;

  rarity: Rarity;

  need: number;

  have: number;

  crafted: number;

  craftUsed: number;

  lack: number;

  overflow: boolean;

  readonly: boolean;
}
