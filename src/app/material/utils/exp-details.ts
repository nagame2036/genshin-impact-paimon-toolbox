import {InventoryItemDetail} from '../models/inventory-item-detail.model';
import {ItemList} from '../models/item-list.model';

export function processExpDetails(expId: number, exps: { id: number, exp: number }[], details: Map<number, InventoryItemDetail>): void {
  const expDetail = details.get(expId);
  if (!expDetail) {
    return;
  }
  expDetail.have = 0;
  expDetail.craftable = 0;
  expDetail.readonly = true;
  const expDetails = exps.map(({exp, id}) => ({detail: details.get(id), exp}));
  for (const {detail, exp} of expDetails) {
    if (detail) {
      detail.lack = Math.max(0, detail.need - detail.have - detail.craftable);
      expDetail.have += detail.have * exp;
      expDetail.craftable += detail.craftable * exp;
    }
  }
  expDetail.lack = Math.max(0, expDetail.need - expDetail.have - expDetail.craftable);
  expDetail.overflow = expDetail.lack === 0;
  for (const {detail} of expDetails) {
    if (detail) {
      detail.overflow = expDetail.overflow || detail.lack === 0;
    }
  }
}

export function splitExpNeed(expNeed: number, exps: { id: number, exp: number }[]): ItemList {
  const list = new ItemList();
  for (const {id, exp} of exps) {
    const need = Math.floor(expNeed / exp);
    list.change(id, need);
    expNeed -= need * exp;
  }
  const length = exps.length;
  if (expNeed > 0 && length > 0) {
    const {id} = exps[length - 1];
    list.change(id, 1);
  }
  return list;
}
