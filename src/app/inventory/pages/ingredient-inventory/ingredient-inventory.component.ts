import {Component, OnInit} from '@angular/core';
import {LocalSpecialtyService} from '../../../material/services/local-specialty.service';
import {OreMaterialService} from '../../../material/services/ore-material.service';
import {combineLatest} from 'rxjs';
import {InventoryItem} from '../../../material/models/inventory-item.model';
import {mora} from '../../../material/models/mora-and-exp.model';

@Component({
  selector: 'app-ingredient-inventory',
  templateUrl: './ingredient-inventory.component.html',
  styleUrls: ['./ingredient-inventory.component.sass']
})
export class IngredientInventoryComponent implements OnInit {

  items: InventoryItem[] = [];

  constructor(private ores: OreMaterialService, private localSpecialties: LocalSpecialtyService) {
  }

  ngOnInit(): void {
    combineLatest([this.ores.items, this.localSpecialties.items])
      .subscribe(([ores, localSpecialties]) => {
        this.items = [mora, ...ores, ...localSpecialties];
      });
  }

}
