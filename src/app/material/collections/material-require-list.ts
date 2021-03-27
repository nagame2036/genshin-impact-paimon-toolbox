import {
  MaterialRequireMark,
  RequireMark,
  RequireMarkDetail,
} from '../models/material-require-mark.model';
import {MaterialDetail} from '../models/material.model';
import {MaterialList} from './material-list';
import {RequireDetail} from '../models/requirement-detail.model';
import {I18n} from '../../widget/models/i18n.model';

const i18n = I18n.create('game-common');

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

  mark(
    materialId: number,
    need: number,
    mark: RequireMark,
  ): MaterialRequireList {
    if (need > 0) {
      const {key, purpose} = mark;
      this.totalNeed.change(materialId, need);
      const marks = this.marks.get(key) ?? new Map<string, RequireMarkDetail>();
      const reqMark = marks.get(purpose) ?? {mark, require: new MaterialList()};
      reqMark.require.change(materialId, need);
      marks.set(purpose, reqMark);
      this.marks.set(key, marks);
    }
    return this;
  }

  update(key: number, that: MaterialRequireList): MaterialRequireList {
    const thatMarks = that.marks.get(key);
    if (!thatMarks) {
      this.remove(key);
      return this;
    }
    const origin = this.marks.get(key);
    if (!origin) {
      for (const mark of thatMarks.values()) {
        this.totalNeed.combine(mark.require);
      }
    } else {
      for (const [purpose, mark] of origin) {
        const thatRequirement = thatMarks.get(purpose)?.require;
        if (!thatRequirement) {
          continue;
        }
        for (const [id, thatNeed] of thatRequirement.entries()) {
          const newNeed = thatNeed - mark.require.getAmount(id);
          this.totalNeed.change(id, newNeed);
        }
      }
    }
    this.marks.set(key, thatMarks);
    return this;
  }

  getDetails(
    key: number,
    totalPurposes: string[],
    materials: Map<number, MaterialDetail>,
  ): RequireDetail[] {
    const purposes = new Map<string, MaterialList>();
    for (const p of totalPurposes) {
      purposes.set(p, new MaterialList());
    }
    const reqMarks = this.marks.get(key);
    if (reqMarks) {
      const total = purposes.get(i18n.module('total-requirement'));
      for (const {mark, require} of reqMarks.values()) {
        const purposeType = mark.purposeType;
        purposes.get(purposeType)?.combine(require);
        total?.combine(require);
      }
    }
    const results = [];
    for (const [purpose, req] of purposes) {
      results.push(processDetail(purpose, req, materials));
    }
    return results.sort(
      (a, b) => totalPurposes.indexOf(a.text) - totalPurposes.indexOf(b.text),
    );
  }

  getMarks(materialId: number): MaterialRequireMark[] {
    const results = [];
    for (const reqMarks of this.marks.values()) {
      for (const {mark, require} of reqMarks.values()) {
        const need = require.getAmount(materialId);
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
          mark.require.combine(thatMark.require);
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

  remove(key: number): void {
    const existing = this.marks.get(key);
    if (existing) {
      for (const mark of existing.values()) {
        for (const [id, need] of mark.require.entries()) {
          this.totalNeed.change(id, -need);
        }
      }
      this.marks.delete(key);
    }
  }

  entries(): [number, number][] {
    return this.totalNeed.entries();
  }
}

function processDetail(
  text: string,
  req: MaterialList,
  materials: Map<number, MaterialDetail>,
): RequireDetail {
  const value = [];
  let reached = true;
  let exists = false;
  for (const [id, need] of req.entries()) {
    const material = materials.get(id);
    if (material) {
      exists = true;
      const detail = material.copy(material.have, need);
      value.push(detail);
      reached &&= detail.overflow;
    }
  }
  reached &&= exists;
  return {text, value, reached};
}
