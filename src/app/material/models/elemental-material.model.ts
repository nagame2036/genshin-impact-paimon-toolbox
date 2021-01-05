import {ElementType} from '../../shared/models/element-type.enum';
import {InventoryItem} from './inventory-item.model';

export interface ElementalMaterial {

  groups: ElementalMaterialGroup[];

  items: ElementalMaterialItem[];
}

export interface ElementalMaterialGroup {

  id: number;

  element: ElementType;

  source: number[];
}

export interface ElementalMaterialItem extends InventoryItem {

  group: number;
}
