import {Injectable} from '@angular/core';
import {MaterialRequireMark} from '../models/material-require-mark.model';
import {ItemList} from '../models/item-list.model';
import {ItemType} from '../../game-common/models/item-type.enum';

@Injectable({
  providedIn: 'root'
})
export class MaterialRequireMarker {

  private marks = new Map<number, MaterialRequireMark[]>();

  constructor() {
  }

  mark(mark: boolean, requirement: ItemList, type: ItemType, id: number, use: string, start: string, goal: string): ItemList {
    if (mark) {
      for (const [itemId, need] of requirement.entries()) {
        if (need <= 0) {
          continue;
        }
        const marks = this.marks.get(itemId) ?? [];
        marks.push({need, type, id, use, start, goal});
        this.marks.set(itemId, marks);
      }
    }
    return requirement;
  }

  getMarks(id: number): MaterialRequireMark[] {
    return this.marks.get(id) ?? [];
  }

  clear(): void {
    this.marks.clear();
  }
}
