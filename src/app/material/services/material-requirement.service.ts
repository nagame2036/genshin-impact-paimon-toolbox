import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {BehaviorSubject, Observable} from 'rxjs';
import {ItemType} from '../../game-common/models/item-type.enum';
import {first, map, tap} from 'rxjs/operators';
import {MaterialRequireList} from '../collections/material-require-list';
import {MaterialRequireMark} from '../models/material-require-mark.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialRequirementService {

  private requirements$ = new BehaviorSubject(new Map<ItemType, MaterialRequireList>());

  private total$ = new BehaviorSubject(new MaterialRequireList());

  constructor(private logger: NGXLogger) {
  }

  getMarks(id: number): Observable<MaterialRequireMark[]> {
    return this.total$.pipe(
      map(total => total.getMarks(id)),
      tap(requirement => this.logger.info('sent material marks', id, requirement)),
    );
  }

  getType(type: ItemType): Observable<MaterialRequireList> {
    return this.requirements$.pipe(
      map(requirements => requirements.get(type) ?? new MaterialRequireList()),
      tap(requirement => this.logger.info('sent type requirement', type, requirement)),
    );
  }

  getAll(): Observable<MaterialRequireList> {
    return this.total$.pipe(
      tap(requirements => this.logger.info('sent all material requirements', requirements)),
    );
  }

  update(type: ItemType, requirements: MaterialRequireList): void {
    this.requirements$.pipe(first()).subscribe(allRequirements => {
      allRequirements.set(type, requirements);
      this.logger.info('update material requirements', type, requirements);
      this.requirements$.next(allRequirements);
      const total = new MaterialRequireList();
      allRequirements.forEach(it => total.combine(it));
      this.total$.next(total);
    });
  }
}
