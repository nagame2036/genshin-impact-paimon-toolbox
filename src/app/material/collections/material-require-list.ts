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

type Materials = Map<number, MaterialDetail>;

export class MaterialRequireList {
  /**
   * The Map of item's id to the Map of its purpose to its mark.
   * @private
   */
  private marks = new Map<number, Map<string, RequireMarkDetail>>();

  private need = new MaterialList();

  constructor(list: MaterialRequireList[] = []) {
    list.forEach(it => this.combine(it));
  }

  mark(materialId: number, need: number, mark: RequireMark): MaterialRequireList {
    if (need > 0) {
      const {key, purpose} = mark;
      this.need.change(materialId, need);
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
    this.marks.get(key)?.forEach(mark => {
      for (const [id, need] of mark.require.entries()) {
        this.need.change(id, -need);
      }
    });
    this.marks.set(key, thatMarks);
    this.need.combineAll(Array.from(thatMarks.values(), it => it.require));
    return this;
  }

  getDetails(key: number, purposes: string[], materials: Materials): RequireDetail[] {
    const purposeMap = new Map(purposes.map(it => [it, new MaterialList()]));
    const reqMarks = this.marks.get(key);
    if (reqMarks) {
      const total = purposeMap.get(i18n.module('total-requirement'));
      for (const {mark, require} of reqMarks.values()) {
        purposeMap.get(mark.purposeType)?.combine(require);
        total?.combine(require);
      }
    }
    const list = Array.from(purposeMap, it => processDetail(it, materials));
    return list.sort((a, b) => purposes.indexOf(a.text) - purposes.indexOf(b.text));
  }

  getMarks(materialId: number): MaterialRequireMark[] {
    return [...this.marks.values()]
      .flatMap(it =>
        Array.from(it.values(), ({mark, require}) => {
          const need = require.getAmount(materialId);
          return need <= 0 ? null : {...mark, need};
        }),
      )
      .filter((it): it is MaterialRequireMark => !!it);
  }

  getNeed(id: number): number {
    return this.need.getAmount(id);
  }

  combine(that: MaterialRequireList): MaterialRequireList {
    this.need.combine(that.need);
    for (const [thatItemKey, thatMarks] of that.marks) {
      const marks = this.marks.get(thatItemKey);
      if (!marks) {
        this.marks.set(thatItemKey, thatMarks);
        continue;
      }
      for (const [thatPurpose, thatMark] of thatMarks) {
        const mark = marks.get(thatPurpose);
        if (!mark) {
          marks.set(thatPurpose, thatMark);
          continue;
        }
        mark.require.combine(thatMark.require);
      }
      this.marks.set(thatItemKey, marks);
    }
    return this;
  }

  remove(key: number): void {
    this.marks.get(key)?.forEach(mark => {
      for (const [id, need] of mark.require.entries()) {
        this.need.change(id, -need);
      }
    });
    this.marks.delete(key);
  }

  entries(): [number, number][] {
    return this.need.entries();
  }
}

function processDetail(origin: [string, MaterialList], materials: Materials): RequireDetail {
  const value = [];
  const [text, req] = origin;
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
