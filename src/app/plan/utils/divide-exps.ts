import {ItemCostList} from '../models/item-cost-list.model';

export function divideExps(remainingExp: number, exps: { id: number, exp: number }[], cost: ItemCostList): ItemCostList {
  for (const {id, exp} of exps) {
    const amount = Math.floor(remainingExp / exp);
    cost.add(id, amount);
    remainingExp -= amount * exp;
  }
  if (remainingExp > 0) {
    const {id} = exps[exps.length - 1];
    cost.add(id, 1);
  }
  return cost;
}
