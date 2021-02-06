import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {BehaviorSubject, Observable} from 'rxjs';
import {ItemType} from '../../game-common/models/item-type.enum';
import {first, map, tap} from 'rxjs/operators';
import {MaterialRequireList} from '../models/material-require-list.model';
import {MaterialRequireMark} from '../models/material-require-mark.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialRequirementService {

  private requirements$ = new BehaviorSubject<Map<ItemType, MaterialRequireList>>(new Map());

  constructor(private logger: NGXLogger) {
  }

  getMarks(id: number): Observable<MaterialRequireMark[]> {
    return this.getRequirements().pipe(
      map(total => total.getMarks(id)),
      tap(requirement => this.logger.info('sent material marks', id, requirement)),
    );
  }

  getType(type: ItemType): Observable<MaterialRequireList> {
    return this.requirements$.pipe(
      map(total => total.get(type) ?? new MaterialRequireList()),
      tap(requirement => this.logger.info('sent type requirement', type, requirement)),
    );
  }

  getAll(): Observable<MaterialRequireList> {
    return this.getRequirements().pipe(
      tap(requirements => this.logger.info('sent all material requirements', requirements)),
    );
  }

  update(type: ItemType, requirements: MaterialRequireList): void {
    this.requirements$.pipe(first()).subscribe(total => {
      total.set(type, requirements);
      this.logger.info('update material requirements', type, requirements);
      this.requirements$.next(total);
    });
  }

  private getRequirements(): Observable<MaterialRequireList> {
    return this.requirements$.pipe(map(total => {
      const result = new MaterialRequireList();
      total.forEach(it => result.combine(it));
      return result;
    }));
  }
}
