import {Component, OnInit} from '@angular/core';
import {MaterialViewService} from '../../../material/services/material-view.service';
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

  constructor(private view: MaterialViewService) {
    super();
  }

  ngOnInit(): void {
    const types = [
      [MaterialType.CURRENCY, MaterialType.ORE],
      [MaterialType.LOCAL_SPECIALTY],
    ];
    this.view
      .view(types)
      .pipe(takeUntil(this.destroy$))
      .subscribe(([common, local]) => {
        this.common = common;
        this.local = local;
      });
  }
}
