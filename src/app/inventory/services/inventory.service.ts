import {Injectable} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {iif, Observable, of, ReplaySubject, zip} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {ItemAmount} from '../../material/models/item-amount.model';
import {CharacterExpMaterialService} from '../../material/services/character-exp-material.service';
import {WeaponExpMaterialService} from '../../material/services/weapon-exp-material.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private readonly storeName = 'materials';

  #inventory = new ReplaySubject<Map<number, ItemAmount>>(1);

  readonly inventory = this.#inventory.asObservable();

  private specificAmount = new Map<number, (inventory: Map<number, ItemAmount>) => Observable<ItemAmount>>([
    [1, inventory => this.characterExps.getExp(inventory)],
    [2, inventory => this.weaponExps.getExp(inventory)]
  ]);

  constructor(private database: NgxIndexedDBService, private characterExps: CharacterExpMaterialService,
              private weaponExps: WeaponExpMaterialService) {
    this.database.getAll(this.storeName).subscribe(res => {
      const inventory = new Map<number, ItemAmount>();
      res.forEach(it => inventory.set(it.id, it));
      this.#inventory.next(inventory);
    });
  }

  getAmount(id: number): Observable<ItemAmount> {
    return this.inventory.pipe(switchMap(inventory => iif(
      () => this.specificAmount.has(id),
      this.specificAmount?.get(id)?.(inventory),
      of({id, amount: inventory.get(id)?.amount ?? 0})
    )));
  }

  setAmount(id: number, amount: number): void {
    const newAmount = {id, amount};
    zip(this.inventory, this.database.update(this.storeName, newAmount)).subscribe(([inventory, _]) => {
      inventory.set(id, newAmount);
      this.#inventory.next(inventory);
    });
  }
}
