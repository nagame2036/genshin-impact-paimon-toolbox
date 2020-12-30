import {ItemAmount} from '../models/item-amount.model';

export function expAmount(inventory: Map<number, ItemAmount>, items: { id: number, exp: number }[]): number {
  return items.reduce((total, item) => {
    const num = inventory.get(item.id)?.amount ?? 0;
    return total + num * item.exp;
  }, 0);
}
