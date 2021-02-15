import {MaterialRequireMark, RequireMark, RequireMarkDetail} from '../models/material-require-mark.model';
import {MaterialDetail} from '../models/material.model';
import {MaterialList} from './material-list';
import {RequirementDetail} from '../models/requirement-detail.model';
import {I18n} from '../../widget/models/i18n.model';

const i18n = new I18n('game-common');

export class MaterialRequireList {

  /**
   * The Map of item's id to the Map of its purpose to its mark.
   * @private
   */
  private marks = new Map<number, Map<string, RequireMarkDetail>>();

  private totalNeed = new MaterialList();

  constructor(list?: MaterialRequireList[]) {
    if (list) {
      this.combineAll(list);
    }
  }

  mark(materialId: number, need: number, mark: RequireMark): MaterialRequireList {
    if (need > 0) {
      const {key, purpose} = mark;
      this.totalNeed.change(materialId, need);
      const reqMarks = this.marks.get(key) ?? new Map<string, RequireMarkDetail>();
      const reqMark = reqMarks.get(purpose) ?? {mark, requirement: new MaterialList()};
      reqMark.requirement.change(materialId, need);
      reqMarks.set(purpose, reqMark);
      this.marks.set(key, reqMarks);
    }
    return this;
  }

  getDetails(key: number, materials: Map<number, MaterialDetail>): RequirementDetail[] {
    const reqMarks = this.marks.get(key);
    const textTotal = i18n.module('total-requirement');
    if (!reqMarks) {
      return [{text: textTotal, value: [], reached: true}];
    }
    const valueTotal = new MaterialList();
    const purposedRequirements = new Map<string, MaterialList>();
    for (const {mark: {purposeType}, requirement} of reqMarks.values()) {
      valueTotal.combine(requirement);
      const purposeReq = purposedRequirements.get(purposeType) ?? new MaterialList();
      purposeReq.combine(requirement);
      purposedRequirements.set(purposeType, purposeReq);
    }
    const results = [];
    results.push(processDetail(textTotal, valueTotal, materials));
    for (const [purpose, req] of purposedRequirements) {
      results.push(processDetail(purpose, req, materials));
    }
    return results;
  }

  getMarks(materialId: number): MaterialRequireMark[] {
    const results = [];
    for (const reqMarks of this.marks.values()) {
      for (const {mark, requirement} of reqMarks.values()) {
        const need = requirement.getAmount(materialId);
        if (need > 0) {
          results.push({...mark, need});
        }
      }
    }
    return results;
  }

  getNeed(id: number): number {
    return this.totalNeed.getAmount(id);
  }

  combine(that: MaterialRequireList): MaterialRequireList {
    this.totalNeed.combine(that.totalNeed);
    for (const [thatItemKey, thatMarks] of that.marks) {
      const marks = this.marks.get(thatItemKey);
      if (!marks) {
        this.marks.set(thatItemKey, thatMarks);
        continue;
      }
      for (const [thatPurpose, thatMark] of thatMarks) {
        const mark = marks.get(thatPurpose);
        if (mark) {
          mark.requirement.combine(thatMark.requirement);
        } else {
          marks.set(thatPurpose, thatMark);
        }
      }
      this.marks.set(thatItemKey, marks);
    }
    return this;
  }

  combineAll(list: MaterialRequireList[]): MaterialRequireList {
    return list.reduce((total, acc) => total.combine(acc), this);
  }
}

function processDetail(text: string, req: MaterialList, materials: Map<number, MaterialDetail>): RequirementDetail {
  const value = [];
  let reached = true;
  for (const [id, need] of req.entries()) {
    const material = materials.get(id);
    if (material) {
      const detail = material.copy();
      detail.update(detail.have, need);
      value.push(detail);
      reached &&= detail.have >= need;
    }
  }
  return {text, value, reached};
}
