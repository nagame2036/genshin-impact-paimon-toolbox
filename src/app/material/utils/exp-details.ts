import {MaterialDetail} from '../models/material.model';
import {MaterialRequireList} from '../collections/material-require-list';
import {RequireMark} from '../models/material-require-mark.model';

type Exp = {id: number; exp?: number};

export function processExpMaterials(
  exps: Exp[],
  materials: Map<number, MaterialDetail>,
): void {
  const expId = exps[0].id;
  const expMaterial = materials.get(expId);
  if (!expMaterial) {
    return;
  }
  expMaterial.have = 0;
  expMaterial.readonly = true;
  for (const {id, exp} of exps) {
    const material = materials.get(id);
    if (material) {
      expMaterial.have += material.have * (exp ?? 0);
    }
  }
  expMaterial.lack = Math.max(0, expMaterial.need - expMaterial.have);
  expMaterial.overflow = expMaterial.lack === 0;
}

export function processExpRequirement(
  exps: Exp[],
  requirement: MaterialRequireList,
  mark: RequireMark,
): void {
  const expId = exps[0].id;
  const length = exps.length;
  if (length < 1) {
    return;
  }
  const {exp: lastItemExp} = exps[length - 2];
  let expNeed = requirement.getNeed(expId);
  for (let i = exps.length - 1; i >= 1; i--) {
    if (expNeed <= 0) {
      break;
    }
    const {id, exp: currItemExp} = exps[i];
    if (!currItemExp) {
      continue;
    }
    let need = Math.floor(expNeed / currItemExp);
    expNeed -= need * currItemExp;
    if (currItemExp - expNeed < (lastItemExp ?? 0)) {
      need += 1;
      expNeed -= currItemExp;
    }
    requirement.mark(id, need, mark);
  }
}
