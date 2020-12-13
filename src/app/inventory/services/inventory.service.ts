import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ItemCost} from '../../shared/models/materials/item-cost';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private readonly storeName = 'materials';

  constructor(private database: NgxIndexedDBService) {
  }

  getAmount(id: number): Observable<ItemCost> {
    return this.database.getByID(this.storeName, id).pipe(map(res => res ?? {id, amount: 0}));
  }

  setAmount(id: number, amount: number): void {
    this.database.update(this.storeName, {id, amount}).subscribe();
  }
}
