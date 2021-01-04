import {Component, OnInit} from '@angular/core';
import {LocalSpecialtyService} from '../../../material/services/local-specialty.service';
import {OreMaterialService} from '../../../material/services/ore-material.service';
import {InventoryItem} from '../../../material/models/inventory-item.model';
import {mora} from '../../../material/models/mora-and-exp.model';
import {AbstractSubInventoryComponent} from '../abstract-sub-inventory.component';

@Component({
  selector: 'app-ingredient-inventory',
  templateUrl: './ingredient-inventory.component.html',
  styleUrls: ['./ingredient-inventory.component.sass']
})
export class IngredientInventoryComponent extends AbstractSubInventoryComponent implements OnInit {

  common: InventoryItem[] = [];

  local: InventoryItem[] = [];

  rarities = [3, 2, 1];

  constructor(private ores: OreMaterialService, private localSpecialties: LocalSpecialtyService) {
    super();
  }

  ngOnInit(): void {
    this.filterItems(this.ores.items)
      .subscribe(items => this.common = [mora, ...items]);
    this.filterItems(this.localSpecialties.items)
      .subscribe(items => this.local = items);
  }

}
