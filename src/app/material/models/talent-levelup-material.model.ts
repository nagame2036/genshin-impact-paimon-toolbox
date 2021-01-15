import {Nation} from '../../shared/models/nation.enum';
import {InventoryItem} from './inventory-item.model';

export interface TalentLevelupMaterial {

  groups: TalentLevelupMaterialGroup[];

  items: TalentLevelupMaterialItem[];
}

export interface TalentLevelupMaterialGroup {

  id: number;

  nation?: Nation;

  weekday?: number;
}

export interface TalentLevelupMaterialItem extends InventoryItem {

  group: number;
}
