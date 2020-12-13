import {Nation} from '../nation.enum';
import {Rarity} from '../rarity.enum';
import {ItemCost} from './item-cost';

export interface TalentMaterial {

  groups: TalentMaterialGroup[];

  items: TalentMaterialItem[];
}

export interface TalentMaterialGroup {

  id: number;

  nation: Nation;

  source: number[];

  weekday: number[];
}

export interface TalentMaterialItem {

  id: number;

  group: number;

  rarity: Rarity;

  craft?: ItemCost[];
}
