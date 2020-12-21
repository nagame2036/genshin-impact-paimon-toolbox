import {Rarity} from '../../shared/models/rarity.enum';
import {ItemCost} from './item-cost';
import {InventoryItem} from './inventory-item';

export interface CommonMaterial {

  groups: CommonMaterialGroup[];

  items: CommonMaterialItem[];
}

export interface CommonMaterialGroup {

  id: number;

  source: number[];
}

export interface CommonMaterialItem extends InventoryItem {

  id: number;

  group: number;

  rarity: Rarity;

  craft?: ItemCost[];
}
