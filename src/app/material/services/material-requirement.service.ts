import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {ReplaySubject} from 'rxjs';
import {ItemType} from '../../game-common/models/item-type.type';
import {MaterialRequireList} from '../collections/material-require-list';
import {MaterialRequireMark} from '../models/material-require-mark.model';
import {Item} from '../../game-common/models/item.model';

@Injectable({
  providedIn: 'root',
})
export class MaterialRequirementService {
  readonly changes = new ReplaySubject<MaterialRequireList>(1);

  private typed = new Map<ItemType, MaterialRequireList>();

  private total = new MaterialRequireList();

  constructor(private logger: NGXLogger) {
    this.changes.next(this.total);
  }

  getMarks(id: number): MaterialRequireMark[] {
    return this.total.getMarks(id);
  }

  getType(type: ItemType): MaterialRequireList {
    let req = this.typed.get(type);
    if (!req) {
      req = new MaterialRequireList();
      this.typed.set(type, req);
    }
    return req;
  }

  update(type: ItemType, key: number, req: MaterialRequireList[]): void {
    const update = new MaterialRequireList(req);
    const typeReq = this.typed.get(type);
    if (typeReq) {
      typeReq.update(key, update);
    } else {
      this.typed.set(type, update);
    }
    this.logger.info('update requirement of item', type, key, update);
    this.total.update(key, update);
    this.changes.next(typeReq || update);
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
      this.changes.next(typeReq);
    }
  }
}
