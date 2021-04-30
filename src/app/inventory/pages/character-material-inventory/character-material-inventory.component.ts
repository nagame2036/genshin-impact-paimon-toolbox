import {Component} from '@angular/core';
import {MaterialViewService} from '../../../material/services/material-view.service';
import {MaterialType} from '../../../material/models/material-type.enum';
import {MaterialDetail} from '../../../material/models/material.model';
import {MaterialListData} from '../../../material/models/material-list-data.model';
import {WithInventory} from '../../abstract/inventory';

@Component({
  selector: 'app-character-material-inventory',
  templateUrl: './character-material-inventory.component.html',
  styleUrls: ['./character-material-inventory.component.scss'],
})
export class CharacterMaterialInventoryComponent extends WithInventory {
  types = [
    [MaterialType.CHARACTER_EXP],
    [MaterialType.CHARACTER_BOSS],
    [MaterialType.CHARACTER_GEM],
  ];

  constructor(view: MaterialViewService) {
    super(view);
  }

  getMaterials([common, boss, gem]: MaterialDetail[][]): MaterialListData[] {
    return [
      {type: 'common', materials: common},
      {type: 'boss', materials: boss},
      {type: 'gem', materials: gem},
    ];
  }
}
