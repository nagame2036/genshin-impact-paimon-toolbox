import {Injectable} from '@angular/core';
import {MaterialRequireMark} from '../models/material-require-mark.model';
import {ItemList} from '../models/item-list.model';
import {ItemType} from '../../game-common/models/item-type.enum';

@Injectable({
  providedIn: 'root'
})
export class MaterialRequireMarker {

  private marks = new Map<ItemType, Map<number, MaterialRequireMark[]>>();

  constructor() {
  }

  mark(mark: boolean, requirement: ItemList, type: ItemType, id: number, key: number, purpose: string, [start, goal]: string[]): ItemList {
    if (mark) {
      const typeMarks = this.marks.get(type) ?? new Map<number, MaterialRequireMark[]>();
      for (const [itemId, need] of requirement.entries()) {
        if (need <= 0) {
          continue;
        }
        const reqMarks = typeMarks.get(itemId) ?? [];
        const index = reqMarks.findIndex(it => it.type === type && it.id === id && it.key === key);
        const reqMark = index !== -1 ? reqMarks[index] : {type, id, key, details: []};
        if (index === -1) {
          reqMarks.push(reqMark);
        }
        reqMark.details.push({purpose, start, goal, need});
        typeMarks.set(itemId, reqMarks);
      }
      this.marks.set(type, typeMarks);
    }
    return requirement;
  }

  getMarks(id: number): MaterialRequireMark[] {
    const marks: MaterialRequireMark[] = [];
    for (const typeMarks of this.marks.values()) {
      const itemMarks = typeMarks.get(id) ?? [];
      marks.push(...itemMarks);
    }
    return marks;
  }

  clear(triggerType: ItemType): void {
    this.marks.get(triggerType)?.clear();
  }
}
