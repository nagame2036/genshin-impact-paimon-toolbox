import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {InventoryItem} from '../models/inventory-item';
import {HttpClient} from '@angular/common/http';
import alasql from 'alasql';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private readonly storeName = 'materials';

  private readonly dataPrefix = 'assets/data/';

  private readonly orderSql = 'SELECT * FROM ? ORDER BY g, rarity DESC';

  constructor(private database: NgxIndexedDBService, private http: HttpClient) {
  }

  getItems(categories: string): Observable<InventoryItem[]> {
    return this.http.get(`${this.dataPrefix + categories}.json`).pipe(map(res => {
      const data = (res as { items: { [id: number]: { group?: number, rarity: number } } }).items;
      const ids = Object.keys(data).map(Number);
      const values = ids.map(i => ({id: i, g: data[i].group || 0, rarity: data[i].rarity}));
      return alasql(this.orderSql, [values]);
    }));
  }

  getAmount(id: number): Observable<{ id: number, amount: number }> {
    return this.database.getByID(this.storeName, id).pipe(map(res => res ? res : {id, amount: 0}));
  }

  setAmount(id: number, amount: number): void {
    this.database.update(this.storeName, {id, amount}).subscribe();
  }
}
