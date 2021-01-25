import {Nation} from '../../game-common/models/nation.enum';
import {InventoryItem} from './inventory-item.model';

export interface LocalSpecialty {

  groups: LocalSpecialtyGroup[];

  items: LocalSpecialtyItem[];
}

export interface LocalSpecialtyGroup {

  id: number;

  nation: Nation;
}

export interface LocalSpecialtyItem extends InventoryItem {

  group: number;
}