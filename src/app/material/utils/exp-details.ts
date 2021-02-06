import {MaterialDetail} from '../models/material.model';
import {MaterialList} from '../models/material-list.model';

export function processExpMaterials(expId: number, exps: { id: number, exp: number }[], materials: Map<number, MaterialDetail>): void {
  const expMaterial = materials.get(expId);
  if (!expMaterial) {
    return;
  }
  expMaterial.readonly = true;
  const expMaterials = exps.map(({exp, id}) => ({exp, material: materials.get(id)}));
  for (const {exp, material} of expMaterials) {
    if (material) {
      expMaterial.have += material.have * exp;
      expMaterial.craftable += material.craftable * exp;
    }
  }
  expMaterial.lack = Math.max(0, expMaterial.need - expMaterial.have - expMaterial.craftable);
  expMaterial.overflow = expMaterial.lack === 0;
  for (const {material} of expMaterials) {
    if (material) {
      material.overflow = expMaterial.overflow || material.lack === 0;
    }
  }
}

export function splitExpNeed(expId: number, exps: { id: number; exp: number }[], cost: MaterialList): void {
  const length = exps.length;
  if (length < 1) {
    return;
  }
  let expNeed = cost.getAmount(expId);
  for (const {id, exp} of exps) {
    const need = Math.floor(expNeed / exp);
    cost.change(id, need);
    expNeed -= need * exp;
  }
  if (expNeed > 0) {
    const {id} = exps[length - 1];
    cost.change(id, 1);
  }
}
