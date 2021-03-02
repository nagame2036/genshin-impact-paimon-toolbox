import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {MaterialList} from '../collections/material-list';
import {NGXLogger} from 'ngx-logger';
import {BehaviorSubject, forkJoin, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MaterialQuantityService {
  private readonly store = 'materials';

  private quantities$ = new BehaviorSubject(new MaterialList());

  readonly quantities = this.quantities$.asObservable();

  constructor(
    private database: NgxIndexedDBService,
    private logger: NGXLogger,
  ) {
    this.database.getAll(this.store).subscribe(materials => {
      this.logger.info('fetched materials quantity', materials);
      const quantities = this.quantities$.value;
      materials.forEach(({id, quantity}) => quantities.change(id, quantity));
      this.quantities$.next(quantities);
    });
  }

  update(id: number, quantity: number): void {
    this.updateDatabase(id, quantity).subscribe(_ => {
      this.logger.info('update material quantity', id, quantity);
      const quantities = this.quantities$.value;
      quantities.setAmount(id, quantity);
      this.quantities$.next(quantities);
    });
  }

  change(materialChange: MaterialList): void {
    const quantities = this.quantities$.value;
    const updateObs = materialChange
      .entries()
      .map(([itemId, itemAmountChange]) => {
        const newAmount = quantities.getAmount(itemId) + itemAmountChange;
        return this.updateDatabase(itemId, newAmount);
      });
    forkJoin(updateObs).subscribe(_ => {
      this.logger.info('change materials quantities', materialChange);
      this.quantities$.next(quantities.combine(materialChange));
    });
  }

  private updateDatabase(id: number, quantity: number): Observable<any[]> {
    return this.database.update(this.store, {id, quantity});
  }
}
