import {Injectable} from '@angular/core';
import {MaterialCostMark} from '../models/material-cost-mark.model';
import {ItemList} from '../models/item-list.model';
import {ItemType} from '../../game-common/models/item-type.enum';

@Injectable({
  providedIn: 'root'
})
export class MaterialCostMarker {

  private marks = new Map<number, MaterialCostMark[]>();

  constructor() {
  }

  mark(mark: boolean, cost: ItemList, type: ItemType, id: number, use: string, start: string, goal: string): ItemList {
    if (mark) {
      for (const [itemId, need] of cost.entries()) {
        if (need <= 0) {
          continue;
        }
        const marks = this.marks.get(itemId) ?? [];
        marks.push({need, type, id, use, start, goal});
        this.marks.set(itemId, marks);
      }
    }
    return cost;
  }

  getMarks(id: number): MaterialCostMark[] {
    return this.marks.get(id) ?? [];
  }

  clear(): void {
    this.marks.clear();
  }
}
