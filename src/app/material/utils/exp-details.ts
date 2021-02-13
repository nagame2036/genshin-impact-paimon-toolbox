import {MaterialDetail} from '../models/material.model';
import {MaterialRequireList} from '../models/material-require-list.model';
import {MaterialRequireMarkTemp} from '../models/material-require-mark.model';

type Exp = { id: number, exp: number };

export function processExpMaterials(expId: number, exps: Exp[], materials: Map<number, MaterialDetail>): void {
  const expMaterial = materials.get(expId);
  if (!expMaterial) {
    return;
  }
  expMaterial.readonly = true;
  const expMaterials = exps.map(({exp, id}) => ({exp, material: materials.get(id)}));
  for (const {exp, material} of expMaterials) {
    if (material) {
      expMaterial.have += material.have * exp;
    }
  }
  expMaterial.lack = Math.max(0, expMaterial.need - expMaterial.have);
  expMaterial.overflow = expMaterial.lack === 0;
  for (const {material} of expMaterials) {
    if (material) {
      material.overflow = expMaterial.overflow || material.lack === 0;
    }
  }
}

export function splitExpNeed(expId: number, exps: Exp[], requirement: MaterialRequireList, mark: MaterialRequireMarkTemp): void {
  const length = exps.length;
  if (length < 1) {
    return;
  }
  let expNeed = requirement.getNeed(expId);
  for (const {id, exp} of exps) {
    const need = Math.floor(expNeed / exp);
    requirement.mark(id, need, mark);
    expNeed -= need * exp;
  }
  if (expNeed > 0) {
    const {id} = exps[length - 1];
    requirement.mark(id, 1, mark);
  }
}
