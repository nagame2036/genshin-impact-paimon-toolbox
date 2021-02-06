import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {MaterialList} from '../models/material-list.model';
import {NGXLogger} from 'ngx-logger';
import {forkJoin, Observable, ReplaySubject, zip} from 'rxjs';
import {first, switchMap, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MaterialQuantityService {

  private readonly store = 'materials';

  private quantities$ = new ReplaySubject<MaterialList>(1);

  readonly quantities = this.quantities$.asObservable();

  constructor(private database: NgxIndexedDBService, private logger: NGXLogger) {
    this.database.getAll(this.store).subscribe(materials => {
      this.logger.info('fetched materials quantity', materials);
      const quantities = new MaterialList();
      materials.forEach(({id, quantity}) => quantities.change(id, quantity));
      this.quantities$.next(quantities);
    });
  }

  update(id: number, quantity: number): void {
    zip(this.updateDatabase(id, quantity), this.quantities).subscribe(([, quantities]) => {
      this.logger.info('update material quantity', id, quantity);
      quantities.setAmount(id, quantity);
      this.quantities$.next(quantities);
    });
  }

  change(materialChange: MaterialList): void {
    this.quantities
      .pipe(
        first(),
        switchMap(quantities => {
          const update = materialChange.entries().map(([itemId, itemAmountChange]) => {
            quantities.change(itemId, itemAmountChange);
            return this.updateDatabase(itemId, quantities.getAmount(itemId));
          });
          return forkJoin([...update]).pipe(tap(_ => {
            this.logger.info('change materials quantities', materialChange);
            this.quantities$.next(quantities);
          }));
        })
      )
      .subscribe();
  }

  private updateDatabase(id: number, quantity: number): Observable<any[]> {
    return this.database.update(this.store, {id, quantity});
  }
}
