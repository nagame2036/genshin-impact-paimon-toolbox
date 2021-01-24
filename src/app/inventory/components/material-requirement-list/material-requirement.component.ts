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
  selector: 'app-material-requirement',
  templateUrl: './material-requirement.component.html',
  styleUrls: ['./material-requirement.component.scss']
})
export class MaterialRequirementComponent implements OnInit {

  i18n = new I18n('inventory');

  @Input()
  subtitles!: string[];

  @Input()
  types: MaterialType[][] = [];

  @Input()
  requirements: { text: string, value: ItemList }[] = [];

  details!: Observable<InventoryItemDetail[]>[];

  requireDetails!: Observable<InventoryItemDetail[]>[];

  constructor(public inventory: InventoryService, private materials: MaterialService) {
  }

  ngOnInit(): void {
    this.details = this.types.map(type => {
      return this.materials.getMaterials(...type).pipe(switchMap(items => this.inventory.getDetails(items)));
    });
    this.changeCost(this.requirements[0].value);
  }

  changeCost(cost: ItemList): void {
    this.requireDetails = this.details.map(details => details.pipe(map(it => selectRequire(it, cost))));
  }
}

function selectRequire(details: InventoryItemDetail[], requirement: ItemList): InventoryItemDetail[] {
  const results: InventoryItemDetail[] = [];
  for (const detail of details) {
    const id = detail.id;
    const need = requirement.getAmount(id);
    if (requirement.has(id) && need > 0) {
      let lack = need - detail.have;
      const craftable = Math.max(0, Math.min(lack, detail.craftable));
      lack = Math.max(0, lack - craftable);
      const overflow = lack <= 0;
      results.push({...detail, need, lack, craftable, overflow});
    }
  }
  return results;
}
