import {MaterialRequireMark, MaterialRequireMarkDetail} from './material-require-mark.model';
import {MaterialList} from './material-list.model';
import {ItemType} from '../../game-common/models/item-type.enum';

export class MaterialRequireList {

  /**
   * The Map of material's id to the Map of requirement item id to it's mark.
   * @private
   */
  private map = new Map<number, Map<number, MaterialRequireMark>>();

  constructor(list?: MaterialRequireList[]) {
    if (list) {
      this.combineAll(list);
    }
  }

  mark(cost: MaterialList, type: ItemType, id: number, key: number, purpose: string, [start, goal]: string[]): MaterialRequireList {
    for (const [materialId, need] of cost.entries()) {
      if (need <= 0) {
        continue;
      }
      const reqMarks = this.map.get(materialId) ?? new Map<number, MaterialRequireMark>();
      const reqMark = reqMarks.get(key) ?? {type, id, key, details: new Map<string, MaterialRequireMarkDetail>()};
      reqMark.details.set(purpose, {purpose, start, goal, need});
      reqMarks.set(key, reqMark);
      this.map.set(materialId, reqMarks);
    }
    return this;
  }

  getNeedByKeyAndPurpose(key: number, purpose: string): MaterialList {
    const requirement = new MaterialList();
    for (const [mid, reqMarks] of this.map.entries()) {
      const detail = reqMarks.get(key)?.details.get(purpose);
      if (detail) {
        requirement.setAmount(mid, detail.need);
      }
    }
    return requirement;
  }

  getMarks(id: number): MaterialRequireMark[] {
    const marks = this.map.get(id);
    return marks ? [...marks.values()] : [];
  }

  getNeed(id: number): number {
    const marks = this.map.get(id);
    if (!marks) {
      return 0;
    }
    let need = 0;
    for (const mark of marks.values()) {
      for (const [, detail] of mark.details) {
        need += detail.need;
      }
    }
    return need;
  }

  combine(that: MaterialRequireList): MaterialRequireList {
    for (const [thatMaterialId, thatMarks] of that.map) {
      const marks = this.map.get(thatMaterialId);
      if (!marks) {
        this.map.set(thatMaterialId, thatMarks);
        continue;
      }
      for (const [thatItemKey, thatMark] of thatMarks) {
        const mark = marks.get(thatItemKey);
        if (!mark) {
          marks.set(thatItemKey, thatMark);
          continue;
        }
        for (const [purpose, detail] of thatMark.details) {
          const need = mark.details.get(purpose)?.need ?? 0;
          mark.details.set(purpose, {...detail, need: need + detail.need});
        }
      }
      this.map.set(thatMaterialId, marks);
    }
    return this;
  }

  combineAll(list: MaterialRequireList[]): MaterialRequireList {
    return list.reduce((total, acc) => total.combine(acc), this);
  }
}
