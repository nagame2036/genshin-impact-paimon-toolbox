import {ItemType} from '../models/item-type.enum';

export function generateItemId(type: ItemType): number {
  const base = new Date().getTime() - 1_000_000_000_000;
  return base * 100 + type;
}
