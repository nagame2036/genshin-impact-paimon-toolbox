import {Nation} from '../../shared/models/nation.enum';
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

  group: number;
}
