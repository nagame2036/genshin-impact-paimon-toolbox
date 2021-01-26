import {Injectable} from '@angular/core';
import {MaterialRequireMark} from '../models/material-require-mark.model';
import {ItemList} from '../models/item-list.model';
import {ItemType} from '../../game-common/models/item-type.enum';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialRequireMarker {

  private marks = new Map<number, MaterialRequireMark[]>();

  #cleared = new Subject();

  cleared = this.#cleared.asObservable();

  constructor() {
  }

  mark(mark: boolean, requirement: ItemList, type: ItemType, id: number, key: number, purpose: string, [start, goal]: string[]): ItemList {
    if (mark) {
      for (const [itemId, need] of requirement.entries()) {
        if (need <= 0) {
          continue;
        }
        const reqMarks = this.marks.get(itemId) ?? [];
        const index = reqMarks.findIndex(it => it.type === type && it.id === id && it.key === key);
        const reqMark = index !== -1 ? reqMarks[index] : {type, id, key, details: []};
        if (index === -1) {
          reqMarks.push(reqMark);
        }
        reqMark.details.push({purpose, start, goal, need});
        this.marks.set(itemId, reqMarks);
      }
    }
    return requirement;
  }

  getMarks(id: number): MaterialRequireMark[] {
    return this.marks.get(id) ?? [];
  }

  clear(): void {
    this.marks.clear();
    this.#cleared.next();
  }
}
