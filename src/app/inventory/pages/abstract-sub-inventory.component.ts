import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {I18n} from '../../shared/models/i18n.model';
import {InventoryService} from '../services/inventory.service';
import {InventoryItemDetail} from '../../material/models/inventory-item-detail.model';
import {MaterialService} from '../../material/services/material.service';
import {MaterialType} from '../../material/models/material-type.enum';

export abstract class AbstractSubInventoryComponent {

  i18n = new I18n('inventory');

  protected constructor(private materials: MaterialService, private inventory: InventoryService) {
  }

  filterMaterials(...types: MaterialType[]): Observable<InventoryItemDetail[]> {
    return this.materials.getMaterials(...types).pipe(switchMap(it => this.inventory.getDetails(it)));
  }
}
