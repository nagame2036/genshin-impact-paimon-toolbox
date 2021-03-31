import {Component} from '@angular/core';
import {MaterialViewService} from '../../../material/services/material-view.service';
import {MaterialType} from '../../../material/models/material-type.enum';
import {MaterialDetail} from '../../../material/models/material.model';
import {MaterialListData} from '../../../material/models/material-list-data.model';
import {AbstractSubInventoryDirective} from '../../directives/abstract-sub-inventory.directive';

@Component({
  selector: 'app-weapon-material-inventory',
  templateUrl: './weapon-material-inventory.component.html',
  styleUrls: ['./weapon-material-inventory.component.scss'],
})
export class WeaponMaterialInventoryComponent extends AbstractSubInventoryDirective {
  types = [
    [MaterialType.WEAPON_EXP],
    [MaterialType.WEAPON_147],
    [MaterialType.WEAPON_257],
    [MaterialType.WEAPON_367],
  ];

  constructor(view: MaterialViewService) {
    super(view);
  }

  getMaterials([
    common,
    monThu,
    tueFri,
    wedSat,
  ]: MaterialDetail[][]): MaterialListData[] {
    return [
      {type: 'common', materials: common},
      {type: '1/4/7', materials: monThu},
      {type: '2/5/7', materials: tueFri},
      {type: '3/6/7', materials: wedSat},
    ];
  }
}
