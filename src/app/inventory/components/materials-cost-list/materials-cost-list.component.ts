import {Component, Input, OnInit} from '@angular/core';
import {InventoryService} from '../../services/inventory.service';
import {ItemList} from '../../../material/models/item-list.model';
import {MaterialService} from '../../../material/services/material.service';
import {MaterialType} from '../../../material/models/material-type.enum';
import {map, switchMap} from 'rxjs/operators';
import {InventoryItemDetail} from '../../../material/models/inventory-item-detail.model';
import {Observable} from 'rxjs';
import {I18n} from '../../../shared/models/i18n.model';

@Component({
  selector: 'app-materials-cost-list',
  templateUrl: './materials-cost-list.component.html',
  styleUrls: ['./materials-cost-list.component.scss']
})
export class MaterialsCostListComponent implements OnInit {

  i18n = new I18n('inventory');

  @Input()
  subtitles!: string[];

  @Input()
  types: MaterialType[][] = [];

  @Input()
  costs: { title: string, cost: ItemList }[] = [];

  details!: Observable<InventoryItemDetail[]>[];

  costMaterials!: Observable<InventoryItemDetail[]>[];

  showOverflow = true;

  constructor(private inventory: InventoryService, private materials: MaterialService) {
  }

  ngOnInit(): void {
    this.details = this.types.map(type => {
      return this.materials.getMaterials(...type).pipe(switchMap(items => this.inventory.getDetails(items)));
    });
    this.changeCost(this.costs[0]);
  }

  changeCost(cost: { title: string, cost: ItemList }): void {
    this.costMaterials = this.details.map(details => details.pipe(map(it => processCostDetails(it, cost.cost))));
  }
}

function processCostDetails(details: InventoryItemDetail[], cost: ItemList): InventoryItemDetail[] {
  const results: InventoryItemDetail[] = [];
  for (const detail of details) {
    const id = detail.id;
    const need = cost.getAmount(id);
    if (cost.has(id) && need > 0) {
      const needCraft = need - detail.have;
      const crafted = Math.max(0, Math.min(needCraft, detail.crafted));
      const lack = Math.max(0, needCraft - crafted);
      const overflow = lack <= 0;
      results.push({...detail, need, lack, crafted, overflow});
    }
  }
  return results;
}
