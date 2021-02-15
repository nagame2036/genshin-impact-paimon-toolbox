import {MaterialDetail} from '../models/material.model';
import {MaterialRequireList} from '../collections/material-require-list';
import {RequireMark} from '../models/material-require-mark.model';

type Exp = { id: number, exp: number };

export function processExpMaterials(expId: number, exps: Exp[], materials: Map<number, MaterialDetail>): void {
  const expMaterial = materials.get(expId);
  if (!expMaterial) {
    return;
  }
  expMaterial.have = 0;
  expMaterial.readonly = true;
  for (const {id, exp} of exps) {
    const material = materials.get(id);
    if (material) {
      expMaterial.have += material.have * exp;
    }
  }
  expMaterial.lack = Math.max(0, expMaterial.need - expMaterial.have);
  expMaterial.overflow = expMaterial.lack === 0;
}

export function splitExpNeed(expId: number, exps: Exp[], requirement: MaterialRequireList, mark: RequireMark): void {
  const length = exps.length;
  if (length < 1) {
    return;
  }
  const {exp: lastItemExp} = exps[length - 1];
  let expNeed = requirement.getNeed(expId);
  for (const {id, exp: currItemExp} of exps) {
    if (expNeed <= 0) {
      break;
    }
    let need = Math.floor(expNeed / currItemExp);
    expNeed -= need * currItemExp;
    if (currItemExp - expNeed < lastItemExp) {
      need += 1;
      expNeed -= currItemExp;
    }
    requirement.mark(id, need, mark);
  }
}
