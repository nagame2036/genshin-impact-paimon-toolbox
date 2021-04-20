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

  constructor(private database: NgxIndexedDBService, private logger: NGXLogger) {
    this.database.getAll(this.store).subscribe(materials => {
      this.logger.info('fetched materials quantity', materials);
      materials.forEach(({id, quantity}) => this.quantities.change(id, quantity));
      this.changes$.next(this.quantities);
    });
  }

  update(id: number, quantity: number): void {
    this.updateDatabase(id, quantity).subscribe(_ => {
      this.quantities.setAmount(id, quantity);
      const changes = new MaterialList();
      changes.setAmount(id, quantity);
      this.logger.info('update material quantity', id, quantity);
      this.changes$.next(changes);
    });
  }

  change(changes: MaterialList): void {
    const updated = new MaterialList();
    const updateObs = changes.entries().map(([id, amountChange]) => {
      const newAmount = this.quantities.getAmount(id) + amountChange;
      updated.change(id, newAmount);
      return this.updateDatabase(id, newAmount);
    });
    forkJoin(updateObs).subscribe(_ => {
      this.logger.info('change materials quantities', changes);
      this.quantities.combine(changes);
      this.changes$.next(updated);
    });
  }

  private updateDatabase(id: number, quantity: number): Observable<any[]> {
    return this.database.update(this.store, {id, quantity});
  }
}
