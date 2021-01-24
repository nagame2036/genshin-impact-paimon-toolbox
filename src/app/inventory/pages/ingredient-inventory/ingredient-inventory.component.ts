import {Component, OnInit} from '@angular/core';
import {MaterialService} from '../../services/material.service';
import {InventoryItemDetail} from '../../models/inventory-item-detail.model';
import {AbstractSubInventoryComponent} from '../abstract-sub-inventory.component';
import {Observable} from 'rxjs';
import {MaterialType} from '../../models/material-type.enum';
import {InventoryService} from '../../services/inventory.service';

@Component({
  selector: 'app-ingredient-inventory',
  templateUrl: './ingredient-inventory.component.html',
  styleUrls: ['./ingredient-inventory.component.scss']
})
export class IngredientInventoryComponent extends AbstractSubInventoryComponent implements OnInit {

  common$!: Observable<InventoryItemDetail[]>;

  local$!: Observable<InventoryItemDetail[]>;

  constructor(materials: MaterialService, inventory: InventoryService) {
    super(materials, inventory);
  }

  ngOnInit(): void {
    this.common$ = this.filterMaterials(MaterialType.CURRENCY, MaterialType.ORE);
    this.local$ = this.filterMaterials(MaterialType.LOCAL_SPECIALTY);
  }

}
