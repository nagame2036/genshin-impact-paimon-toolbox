import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {ReplaySubject} from 'rxjs';
import {ItemType} from '../../game-common/models/item-type.enum';
import {MaterialRequireList} from '../collections/material-require-list';
import {MaterialRequireMark} from '../models/material-require-mark.model';
import {Item} from '../../game-common/models/item.model';

@Injectable({
  providedIn: 'root',
})
export class MaterialRequirementService {
  private typed = new Map<ItemType, MaterialRequireList>();

  private total = new MaterialRequireList();

  readonly changes = new ReplaySubject<MaterialRequireList>(1);

  constructor(private logger: NGXLogger) {
    this.changes.next(this.total);
  }

  getMarks(id: number): MaterialRequireMark[] {
    const marks = this.total.getMarks(id);
    this.logger.info('sent marks of material', id, marks);
    return marks;
  }

  getType(type: ItemType): MaterialRequireList {
    const req = this.typed.get(type) ?? new MaterialRequireList();
    if (!this.typed.has(type)) {
      this.typed.set(type, req);
    }
    this.logger.info('sent requirement of item type', type, req);
    return req;
  }

  update(type: ItemType, key: number, req: MaterialRequireList): void {
    const typeReq = this.typed.get(type);
    if (typeReq) {
      typeReq.update(key, req);
    } else {
      this.typed.set(type, req);
    }
    this.logger.info('update requirement of item', type, key, req);
    this.total.update(key, req);
    this.changes.next(this.total);
  }

  remove(type: ItemType, key: number): void {
    const typeReq = this.typed.get(type);
    if (typeReq) {
      typeReq.remove(key);
      this.total.remove(key);
      this.logger.info('remove requirement of item', type, key);
      this.changes.next(this.total);
    }
  }

  removeAll(type: ItemType, items: Item<any>[]): void {
    const typeReq = this.typed.get(type);
    if (typeReq) {
      for (const item of items) {
        const id = item.plan.id;
        typeReq.remove(id);
        this.total.remove(id);
      }
      this.logger.info('remove all requirements of items', type, items);
      this.changes.next(this.total);
    }
  }
}
