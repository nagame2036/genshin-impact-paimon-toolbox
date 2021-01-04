import {ItemCostList} from '../../plan/models/item-cost-list.model';

export function divideExps(expNeed: number, exps: { id: number, exp: number }[], cost: ItemCostList): ItemCostList {
  for (const {id, exp} of exps) {
    const amount = Math.floor(expNeed / exp);
    cost.add(id, amount);
    console.log(id, amount);
    expNeed -= amount * exp;
  }
  if (expNeed > 0) {
    const {id} = exps[exps.length - 1];
    cost.add(id, 1);
  }
  return cost;
}
