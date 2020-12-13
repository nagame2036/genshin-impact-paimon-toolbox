import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {InventoryData, InventoryItem} from '../models/inventory-item';
import {HttpClient} from '@angular/common/http';
import alasql from 'alasql';
import {ItemCost} from '../../shared/models/materials/item-cost';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private readonly storeName = 'materials';

  private readonly dataPrefix = 'assets/data/materials/';

  private readonly orderSql = 'SELECT id, [group], COALESCE(rarity, 1) as rarity FROM ? ORDER BY [group], rarity DESC';

  constructor(private database: NgxIndexedDBService, private http: HttpClient) {
  }

  getItems(category: string): Observable<InventoryItem[]> {
    return this.http.get<InventoryData>(`${this.dataPrefix + category}.json`)
      .pipe(map(res => alasql(this.orderSql, [res.items])));
  }

  getAmount(id: number): Observable<ItemCost> {
    return this.database.getByID(this.storeName, id).pipe(map(res => res ?? {id, amount: 0}));
  }

  setAmount(id: number, amount: number): void {
    this.database.update(this.storeName, {id, amount}).subscribe();
  }
}
