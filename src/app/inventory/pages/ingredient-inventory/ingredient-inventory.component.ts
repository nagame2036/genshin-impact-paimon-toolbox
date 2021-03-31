import {Component} from '@angular/core';
import {MaterialViewService} from '../../../material/services/material-view.service';
import {MaterialDetail} from '../../../material/models/material.model';
import {MaterialType} from '../../../material/models/material-type.enum';
import {MaterialListData} from '../../../material/models/material-list-data.model';
import {AbstractSubInventoryDirective} from '../../directives/abstract-sub-inventory.directive';

@Component({
  selector: 'app-ingredient-inventory',
  templateUrl: './ingredient-inventory.component.html',
  styleUrls: ['./ingredient-inventory.component.scss'],
})
export class IngredientInventoryComponent extends AbstractSubInventoryDirective {
  types = [
    [MaterialType.CURRENCY, MaterialType.ORE],
    [MaterialType.LOCAL_SPECIALTY],
  ];

  constructor(view: MaterialViewService) {
    super(view);
  }

  getMaterials([common, local]: MaterialDetail[][]): MaterialListData[] {
    return [
      {type: 'common', materials: common},
      {type: 'local-specialty', materials: local},
    ];
  }
}
