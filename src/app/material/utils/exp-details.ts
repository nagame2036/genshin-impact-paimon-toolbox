import {InventoryItemDetail} from '../models/inventory-item-detail.model';

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
  let expNeed = expDetail.need;
  const expDetails = exps.map(({exp, id}) => ({detail: details.get(id), exp}));
  for (const {detail, exp} of expDetails) {
    if (detail) {
      const need = Math.floor(expNeed / exp);
      detail.need = need;
      expNeed -= need * exp;
    }
  }
  if (expNeed > 0) {
    const {detail} = expDetails[exps.length - 1];
    if (detail) {
      detail.need += 1;
    }
  }
}
