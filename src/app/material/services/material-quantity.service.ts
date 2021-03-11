import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {MaterialList} from '../collections/material-list';
import {NGXLogger} from 'ngx-logger';
import {forkJoin, Observable, ReplaySubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MaterialQuantityService {
  private readonly store = 'materials';

  private readonly quantities = new MaterialList();

  private changes$ = new ReplaySubject<MaterialList>(1);

  readonly changes = this.changes$.asObservable();

  constructor(
    private database: NgxIndexedDBService,
    private logger: NGXLogger,
  ) {
    this.database.getAll(this.store).subscribe(materials => {
      this.logger.info('fetched materials quantity', materials);
      const quantities = new MaterialList();
      materials.forEach(({id, quantity}) => quantities.change(id, quantity));
      this.quantities.combine(quantities);
      this.changes$.next(quantities);
    });
  }

  update(id: number, quantity: number): void {
    this.updateDatabase(id, quantity).subscribe(_ => {
      this.quantities.setAmount(id, quantity);
      const quantities = new MaterialList();
      quantities.setAmount(id, quantity);
      this.logger.info('update material quantity', id, quantity);
      this.changes$.next(quantities);
    });
  }

  change(materialChanges: MaterialList): void {
    const changes = new MaterialList();
    const updateObs = materialChanges
      .entries()
      .map(([itemId, itemAmountChange]) => {
        const newAmount = this.quantities.getAmount(itemId) + itemAmountChange;
        changes.setAmount(itemId, newAmount);
        return this.updateDatabase(itemId, newAmount);
      });
    forkJoin(updateObs).subscribe(_ => {
      this.logger.info('change materials quantities', materialChanges);
      this.quantities.combine(materialChanges);
      this.changes$.next(changes);
    });
  }

  private updateDatabase(id: number, quantity: number): Observable<any[]> {
    return this.database.update(this.store, {id, quantity});
  }
}
