import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {BehaviorSubject, Observable, zip} from 'rxjs';
import {ItemType} from '../../game-common/models/item-type.enum';
import {first, map, tap} from 'rxjs/operators';
import {MaterialRequireList} from '../collections/material-require-list';
import {MaterialRequireMark} from '../models/material-require-mark.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialRequirementService {

  private typed$ = new BehaviorSubject(new Map<ItemType, MaterialRequireList>());

  private total$ = new BehaviorSubject(new MaterialRequireList());

  constructor(private logger: NGXLogger) {
  }

  getMarks(id: number): Observable<MaterialRequireMark[]> {
    return this.total$.pipe(
      map(total => total.getMarks(id)),
      tap(marks => this.logger.info('sent material marks of material', id, marks)),
    );
  }

  getType(type: ItemType): Observable<MaterialRequireList> {
    return this.typed$.pipe(
      map(requirements => requirements.get(type) ?? new MaterialRequireList()),
      tap(requirement => this.logger.info('sent requirement of item type', type, requirement)),
    );
  }

  getAll(): Observable<MaterialRequireList> {
    return this.total$.pipe(
      tap(requirements => this.logger.info('sent all material requirements', requirements)),
    );
  }

  update(type: ItemType, key: number, requirements: MaterialRequireList): Observable<void> {
    return zip(this.typed$, this.total$).pipe(first(), map(([typeReqs, total]) => {
      const typeRed = typeReqs.get(type);
      if (typeRed) {
        typeRed.replace(key, requirements);
      } else {
        typeReqs.set(type, requirements);
      }
      this.logger.info('update material requirements of item', type, key, requirements);
      this.typed$.next(typeReqs);
      total.replace(key, requirements);
      this.total$.next(total);
    }));
  }

  remove(type: ItemType, key: number): Observable<void> {
    return zip(this.typed$, this.total$).pipe(first(), map(([typeReqs, total]) => {
      const typeReq = typeReqs.get(type);
      if (typeReq) {
        typeReq.remove(key);
        this.logger.info('remove material requirements of item', type, key);
        this.typed$.next(typeReqs);
        total.remove(key);
        this.total$.next(total);
      }
    }));
  }

  removeAll(type: ItemType, keys: number[]): Observable<void> {
    return zip(this.typed$, this.total$).pipe(first(), map(([typeReqs, total]) => {
      const typeReq = typeReqs.get(type);
      if (typeReq) {
        keys.forEach(it => typeReq.remove(it));
        this.logger.info('remove all material requirements of items', type, keys);
        this.typed$.next(typeReqs);
        keys.forEach(it => total.remove(it));
        this.total$.next(total);
      }
    }));
  }
}
