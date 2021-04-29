import {ItemType, itemTypeNames} from '../models/item-type.type';

export function generateItemId(type: ItemType, offset: number = 0): number {
  const base = new Date().getTime() + offset - 1_000_000_000_000;
  return base * 100 + itemTypeNames.indexOf(type);
}
