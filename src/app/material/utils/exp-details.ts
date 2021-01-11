import {InventoryItemDetail} from '../models/inventory-item-detail.model';
import {ItemList} from '../models/item-list.model';

export function processExpDetails(expId: number, exps: { id: number, exp: number }[], details: Map<number, InventoryItemDetail>): void {
  const expDetail = details.get(expId);
  if (!expDetail) {
    return;
  }
  expDetail.have = 0;
  expDetail.crafted = 0;
  expDetail.readonly = true;
  const expDetails = exps.map(({exp, id}) => ({detail: details.get(id), exp}));
  for (const {detail, exp} of expDetails) {
    if (detail) {
      detail.lack = Math.max(0, detail.need - detail.have - detail.crafted);
      expDetail.have += detail.have * exp;
      expDetail.crafted += detail.crafted * exp;
    }
  }
  expDetail.lack = Math.max(0, expDetail.need - expDetail.have - expDetail.crafted);
  expDetail.overflow = expDetail.lack === 0;
  for (const {detail} of expDetails) {
    if (detail) {
      detail.overflow = expDetail.overflow || detail.lack === 0;
    }
  }
}

export function calculateExpNeed(expId: number, exps: { id: number, exp: number }[], details: Map<number, InventoryItemDetail>): void {
  const expDetail = details.get(expId);
  if (!expDetail) {
    return;
  }
  const expNeed = expDetail.need;
  if (expNeed <= 0) {
    return;
  }
  const list = splitExpNeed(expNeed, exps);
  for (const [id, need] of list.entries()) {
    const detail = details.get(id);
    if (detail) {
      detail.need = need;
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
