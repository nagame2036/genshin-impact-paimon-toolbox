import {Component, OnInit} from '@angular/core';
import {LocalSpecialtyService} from '../../../material/services/local-specialty.service';
import {OreMaterialService} from '../../../material/services/ore-material.service';
import {combineLatest} from 'rxjs';
import {InventoryItem} from '../../../material/models/inventory-item.model';
import {mora} from '../../../material/models/mora-and-exp.model';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';

@Component({
  selector: 'app-ingredient-inventory',
  templateUrl: './ingredient-inventory.component.html',
  styleUrls: ['./ingredient-inventory.component.sass']
})
export class IngredientInventoryComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'inventory';

  common: InventoryItem[] = [];

  local: InventoryItem[] = [];

  constructor(private ores: OreMaterialService, private localSpecialties: LocalSpecialtyService) {
    super();
  }

  ngOnInit(): void {
    combineLatest([this.ores.items, this.localSpecialties.items])
      .subscribe(([ores, localSpecialties]) => {
        this.common = [mora, ...ores];
        this.local = localSpecialties;
      });
  }

}
