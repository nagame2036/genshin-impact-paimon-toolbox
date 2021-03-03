import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {BehaviorSubject, Observable} from 'rxjs';
import {ItemType} from '../../game-common/models/item-type.enum';
import {map, tap} from 'rxjs/operators';
import {MaterialRequireList} from '../collections/material-require-list';
import {MaterialRequireMark} from '../models/material-require-mark.model';

@Injectable({
  providedIn: 'root',
})
export class MaterialRequirementService {
  private typed$ = new BehaviorSubject(
    new Map<ItemType, MaterialRequireList>(),
  );

  readonly total = new BehaviorSubject(new MaterialRequireList());

  constructor(private logger: NGXLogger) {}

  getMarks(id: number): Observable<MaterialRequireMark[]> {
    return this.total.pipe(
      map(total => total.getMarks(id)),
      tap(marks => this.logger.info('sent marks of material', id, marks)),
    );
  }

  getType(type: ItemType): Observable<MaterialRequireList> {
    return this.typed$.pipe(
      map(requirements => requirements.get(type) ?? new MaterialRequireList()),
      tap(req => this.logger.info('sent requirement of item type', type, req)),
    );
  }

  update(type: ItemType, key: number, req: MaterialRequireList): void {
    const [typed, total] = [this.typed$.value, this.total.value];
    const typeReq = typed.get(type);
    if (typeReq) {
      typeReq.update(key, req);
    } else {
      typed.set(type, req);
    }
    this.logger.info('update requirement of item', type, key, req);
    this.typed$.next(typed);
    total.update(key, req);
    this.total.next(total);
  }

  remove(type: ItemType, key: number): void {
    const [typed, total] = [this.typed$.value, this.total.value];
    const typeReq = typed.get(type);
    if (typeReq) {
      typeReq.remove(key);
      this.logger.info('remove requirement of item', type, key);
      this.typed$.next(typed);
      total.remove(key);
      this.total.next(total);
    }
  }

  removeAll(type: ItemType, keys: number[]): void {
    const [typed, total] = [this.typed$.value, this.total.value];
    const typeReq = typed.get(type);
    if (typeReq) {
      keys.forEach(it => {
        typeReq.remove(it);
        total.remove(it);
      });
      this.logger.info('remove all requirements of items', type, keys);
      this.typed$.next(typed);
      this.total.next(total);
    }
  }
}
