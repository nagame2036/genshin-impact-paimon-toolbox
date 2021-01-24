import {Component, OnInit} from '@angular/core';
import {MaterialService} from '../../services/material.service';
import {InventoryItemDetail} from '../../models/inventory-item-detail.model';
import {AbstractSubInventoryComponent} from '../abstract-sub-inventory.component';
import {Observable} from 'rxjs';
import {MaterialType} from '../../models/material-type.enum';
import {InventoryService} from '../../services/inventory.service';

@Component({
  selector: 'app-weapon-material-inventory',
  templateUrl: './weapon-material-inventory.component.html',
  styleUrls: ['./weapon-material-inventory.component.scss']
})
export class WeaponMaterialInventoryComponent extends AbstractSubInventoryComponent implements OnInit {

  common$!: Observable<InventoryItemDetail[]>;

  monThu$!: Observable<InventoryItemDetail[]>;

  tueFri$!: Observable<InventoryItemDetail[]>;

  wedSat$!: Observable<InventoryItemDetail[]>;

  constructor(materials: MaterialService, inventory: InventoryService) {
    super(materials, inventory);
  }

  ngOnInit(): void {
    this.common$ = this.filterMaterials(MaterialType.WEAPON_EXP);
    this.monThu$ = this.filterMaterials(MaterialType.WEAPON_14);
    this.tueFri$ = this.filterMaterials(MaterialType.WEAPON_25);
    this.wedSat$ = this.filterMaterials(MaterialType.WEAPON_36);
  }
}
