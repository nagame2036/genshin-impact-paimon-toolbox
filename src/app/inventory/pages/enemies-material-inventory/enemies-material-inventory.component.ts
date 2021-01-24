import {Component, OnInit} from '@angular/core';
import {InventoryItemDetail} from '../../models/inventory-item-detail.model';
import {MaterialService} from '../../services/material.service';
import {AbstractSubInventoryComponent} from '../abstract-sub-inventory.component';
import {MaterialType} from '../../models/material-type.enum';
import {Observable} from 'rxjs';
import {InventoryService} from '../../services/inventory.service';

@Component({
  selector: 'app-enemies-material-inventory',
  templateUrl: './enemies-material-inventory.component.html',
  styleUrls: ['./enemies-material-inventory.component.scss']
})
export class EnemiesMaterialInventoryComponent extends AbstractSubInventoryComponent implements OnInit {

  mobs$!: Observable<InventoryItemDetail[]>;

  elites$!: Observable<InventoryItemDetail[]>;

  constructor(materials: MaterialService, inventory: InventoryService) {
    super(materials, inventory);
  }

  ngOnInit(): void {
    this.mobs$ = this.filterMaterials(MaterialType.ENEMY_MOB);
    this.elites$ = this.filterMaterials(MaterialType.ENEMY_ELITE);
  }

}
