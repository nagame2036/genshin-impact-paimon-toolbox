import {Component, OnInit} from '@angular/core';
import {MaterialService} from '../../../material/services/material.service';
import {InventoryItem} from '../../../material/models/inventory-item.model';
import {AbstractSubInventoryComponent} from '../abstract-sub-inventory.component';
import {Observable} from 'rxjs';
import {MaterialTypes} from '../../../material/models/material-types.enum';

@Component({
  selector: 'app-ingredient-inventory',
  templateUrl: './ingredient-inventory.component.html',
  styleUrls: ['./ingredient-inventory.component.scss']
})
export class IngredientInventoryComponent extends AbstractSubInventoryComponent implements OnInit {

  common$!: Observable<InventoryItem[]>;

  local$!: Observable<InventoryItem[]>;

  rarities = [3, 2, 1];

  constructor(private materials: MaterialService) {
    super();
  }

  ngOnInit(): void {
    this.common$ = this.filterItems(this.materials.getMaterials(MaterialTypes.CURRENCY, MaterialTypes.ORE));
    this.local$ = this.filterItems(this.materials.getMaterials(MaterialTypes.LOCAL_SPECIALTY));
  }

}
