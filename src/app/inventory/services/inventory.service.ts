import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private database: NgxIndexedDBService) {
  }

  private readonly storeName = 'materials';

  getAmount(id: number): Observable<{ id: number, amount: number }> {
    return this.database.getByID(this.storeName, id).pipe(map(res => res ? res : {id, amount: 0}));
  }

  setAmount(id: number, amount: number): void {
    this.database.update(this.storeName, {id, amount}).subscribe();
  }
}
