import {Component, Input, OnInit} from '@angular/core';
import {InventoryService} from '../../services/inventory.service';
import {ItemList} from '../../models/item-list.model';
import {MaterialService} from '../../services/material.service';
import {MaterialType} from '../../models/material-type.enum';
import {map, switchMap} from 'rxjs/operators';
import {InventoryItemDetail} from '../../models/inventory-item-detail.model';
import {Observable} from 'rxjs';
import {I18n} from '../../../widget/models/i18n.model';

@Component({
  selector: 'app-material-cost-list',
  templateUrl: './material-cost-list.component.html',
  styleUrls: ['./material-cost-list.component.scss']
})
export class MaterialCostListComponent implements OnInit {

  i18n = new I18n('inventory');

  @Input()
  subtitles!: string[];

  @Input()
  types: MaterialType[][] = [];

  @Input()
  costs: { text: string, value: ItemList }[] = [];

  details!: Observable<InventoryItemDetail[]>[];

  costMaterials!: Observable<InventoryItemDetail[]>[];

  constructor(public inventory: InventoryService, private materials: MaterialService) {
  }

  ngOnInit(): void {
    this.details = this.types.map(type => {
      return this.materials.getMaterials(...type).pipe(switchMap(items => this.inventory.getDetails(items)));
    });
    this.changeCost(this.costs[0].value);
  }

  changeCost(cost: ItemList): void {
    this.costMaterials = this.details.map(details => details.pipe(map(it => processCostDetails(it, cost))));
  }
}

function processCostDetails(details: InventoryItemDetail[], cost: ItemList): InventoryItemDetail[] {
  const results: InventoryItemDetail[] = [];
  for (const detail of details) {
    const id = detail.id;
    const need = cost.getAmount(id);
    if (cost.has(id) && need > 0) {
      let lack = need - detail.have;
      const craftable = Math.max(0, Math.min(lack, detail.craftable));
      lack = Math.max(0, lack - craftable);
      const overflow = lack <= 0;
      results.push({...detail, need, lack, craftable, overflow});
    }
  }
  return results;
}
