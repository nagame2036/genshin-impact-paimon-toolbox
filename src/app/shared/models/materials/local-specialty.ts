import {Nation} from '../nation.enum';
import {InventoryItem} from './inventory-item';

export interface LocalSpecialty {

  groups: LocalSpecialtyGroup[];

  items: LocalSpecialtyItem[];
}

export interface LocalSpecialtyGroup {

  id: number;

  nation: Nation;
}

export interface LocalSpecialtyItem extends InventoryItem {

  id: number;

  group: number;
}
