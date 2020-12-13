import {Rarity} from '../rarity.enum';
import {ItemCost} from './item-cost';

export interface EnemiesMaterialsData {

  groups: EnemiesMaterialGroup[];

  items: EnemiesMaterialItem[];
}

export interface EnemiesMaterialGroup {

  id: number;

  source: number[];
}

export interface EnemiesMaterialItem {

  id: number;

  group: number;

  rarity: Rarity;

  craft?: ItemCost[];
}
