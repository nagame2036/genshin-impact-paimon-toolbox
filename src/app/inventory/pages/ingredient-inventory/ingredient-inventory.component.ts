import {Component, OnInit} from '@angular/core';
import {MaterialService} from '../../../material/services/material.service';
import {InventoryItemDetail} from '../../../material/models/inventory-item-detail.model';
import {AbstractSubInventoryComponent} from '../abstract-sub-inventory.component';
import {Observable} from 'rxjs';
import {MaterialType} from '../../../material/models/material-type.enum';
import {InventoryService} from '../../services/inventory.service';

@Component({
  selector: 'app-ingredient-inventory',
  templateUrl: './ingredient-inventory.component.html',
  styleUrls: ['./ingredient-inventory.component.scss']
})
export class IngredientInventoryComponent extends AbstractSubInventoryComponent implements OnInit {

  common$!: Observable<InventoryItemDetail[]>;

  local$!: Observable<InventoryItemDetail[]>;

  rarities = [3, 2, 1];

  constructor(private materials: MaterialService, inventory: InventoryService) {
    super(inventory);
  }

  ngOnInit(): void {
    this.common$ = this.filterItems(this.materials.getMaterials(MaterialType.CURRENCY, MaterialType.ORE));
    this.local$ = this.filterItems(this.materials.getMaterials(MaterialType.LOCAL_SPECIALTY));
  }

}
