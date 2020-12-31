import {Nation} from '../../shared/models/nation.enum';
import {Rarity} from '../../shared/models/rarity.enum';
import {ItemAmount} from './item-amount.model';
import {InventoryItem} from './inventory-item.model';

export interface TalentMaterial {

  groups: TalentMaterialGroup[];

  items: TalentMaterialItem[];
}

export interface TalentMaterialGroup {

  id: number;

  nation: Nation;

  source: number[];

  weekday: number;
}

export interface TalentMaterialItem extends InventoryItem {

  id: number;

  group: number;

  rarity: Rarity;

  craft?: ItemAmount[];
}
