import {Component} from '@angular/core';
import {MaterialViewService} from '../../../material/services/material-view.service';
import {MaterialType} from '../../../material/models/material-type.enum';
import {MaterialDetail} from '../../../material/models/material.model';
import {MaterialListData} from '../../../material/models/material-list-data.model';
import {WithInventory} from '../../abstract/inventory';

@Component({
  selector: 'app-enemy-material-inventory',
  templateUrl: './enemy-material-inventory.component.html',
  styleUrls: ['./enemy-material-inventory.component.scss'],
})
export class EnemyMaterialInventoryComponent extends WithInventory {
  types = [[MaterialType.ENEMY_MOB], [MaterialType.ENEMY_ELITE]];

  constructor(view: MaterialViewService) {
    super(view);
  }

  getMaterials([mob, elite]: MaterialDetail[][]): MaterialListData[] {
    return [
      {type: 'mob', materials: mob},
      {type: 'elite', materials: elite},
    ];
  }
}
