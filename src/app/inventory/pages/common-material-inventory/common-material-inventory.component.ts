import {Component, OnInit} from '@angular/core';
import {InventoryItemDetail} from '../../../material/models/inventory-item-detail.model';
import {MaterialService} from '../../../material/services/material.service';
import {AbstractSubInventoryComponent} from '../abstract-sub-inventory.component';
import {MaterialType} from '../../../material/models/material-type.enum';
import {Observable} from 'rxjs';
import {InventoryService} from '../../services/inventory.service';

@Component({
  selector: 'app-common-material-inventory',
  templateUrl: './common-material-inventory.component.html',
  styleUrls: ['./common-material-inventory.component.scss']
})
export class CommonMaterialInventoryComponent extends AbstractSubInventoryComponent implements OnInit {

  mobs$!: Observable<InventoryItemDetail[]>;

  elites$!: Observable<InventoryItemDetail[]>;

  rarities = [4, 3, 2, 1];

  constructor(materials: MaterialService, inventory: InventoryService) {
    super(materials, inventory);
  }

  ngOnInit(): void {
    this.mobs$ = this.filterMaterials(MaterialType.COMMON_MOB);
    this.elites$ = this.filterMaterials(MaterialType.COMMON_ELITE);
  }

}
