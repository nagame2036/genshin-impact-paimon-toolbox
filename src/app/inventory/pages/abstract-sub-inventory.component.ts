import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {I18n} from '../../widget/models/i18n.model';
import {InventoryService} from '../services/inventory.service';
import {InventoryItemDetail} from '../models/inventory-item-detail.model';
import {MaterialService} from '../services/material.service';
import {MaterialType} from '../models/material-type.enum';

export abstract class AbstractSubInventoryComponent {

  i18n = new I18n('inventory');

  protected constructor(private materials: MaterialService, private inventory: InventoryService) {
  }

  filterMaterials(...types: MaterialType[]): Observable<InventoryItemDetail[]> {
    return this.materials.getMaterials(...types).pipe(switchMap(it => this.inventory.getDetails(it)));
  }
}
