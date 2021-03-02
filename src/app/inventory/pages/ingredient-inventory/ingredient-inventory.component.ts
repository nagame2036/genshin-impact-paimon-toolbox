import {Component, OnInit} from '@angular/core';
import {MaterialService} from '../../../material/services/material.service';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {takeUntil} from 'rxjs/operators';
import {MaterialDetail} from '../../../material/models/material.model';
import {MaterialType} from '../../../material/models/material-type.enum';

@Component({
  selector: 'app-ingredient-inventory',
  templateUrl: './ingredient-inventory.component.html',
  styleUrls: ['./ingredient-inventory.component.scss'],
})
export class IngredientInventoryComponent
  extends AbstractObservableComponent
  implements OnInit {
  common!: MaterialDetail[];

  local!: MaterialDetail[];

  constructor(private materials: MaterialService) {
    super();
  }

  ngOnInit(): void {
    this.materials.filtered
      .pipe(takeUntil(this.destroy$))
      .subscribe(materials => {
        const currencies = materials.get(MaterialType.CURRENCY) ?? [];
        const ores = materials.get(MaterialType.ORE) ?? [];
        this.common = [...currencies, ...ores];
        this.local = materials.get(MaterialType.LOCAL_SPECIALTY) ?? [];
      });
  }
}
