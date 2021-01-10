import {ElementType} from '../../shared/models/element-type.enum';
import {InventoryItem} from './inventory-item.model';

export interface CharacterMaterial {

  groups: CharacterMaterialGroup[];

  items: CharacterMaterialItem[];
}

export interface CharacterMaterialGroup {

  id: number;

  element?: ElementType;

  source?: number[];
}

export interface CharacterMaterialItem extends InventoryItem {

  group: number;
}
