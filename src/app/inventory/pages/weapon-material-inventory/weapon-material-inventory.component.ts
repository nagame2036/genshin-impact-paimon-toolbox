import {Component, OnInit} from '@angular/core';
import {MaterialService} from '../../../material/services/material.service';
import {InventoryItemDetail} from '../../../material/models/inventory-item-detail.model';
import {AbstractSubInventoryComponent} from '../abstract-sub-inventory.component';
import {Observable} from 'rxjs';
import {MaterialType} from '../../../material/models/material-type.enum';
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

  constructor(private materials: MaterialService, inventory: InventoryService) {
    super(inventory);
  }

  ngOnInit(): void {
    this.common$ = this.filterItems(this.materials.getMaterials(MaterialType.WEAPON_EXP));
    this.monThu$ = this.filterItems(this.materials.getMaterials(MaterialType.WEAPON_14));
    this.tueFri$ = this.filterItems(this.materials.getMaterials(MaterialType.WEAPON_25));
    this.wedSat$ = this.filterItems(this.materials.getMaterials(MaterialType.WEAPON_36));
  }
}
