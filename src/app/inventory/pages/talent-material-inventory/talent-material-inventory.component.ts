import {Component} from '@angular/core';
import {MaterialViewService} from '../../../material/services/material-view.service';
import {MaterialType} from '../../../material/models/material-type.enum';
import {MaterialDetail} from '../../../material/models/material.model';
import {MaterialListData} from '../../../material/models/material-list-data.model';
import {AbstractSubInventoryDirective} from '../../directives/abstract-sub-inventory.directive';

@Component({
  selector: 'app-talent-material-inventory',
  templateUrl: './talent-material-inventory.component.html',
  styleUrls: ['./talent-material-inventory.component.scss'],
})
export class TalentMaterialInventoryComponent extends AbstractSubInventoryDirective {
  types = [
    [MaterialType.TALENT_COMMON],
    [MaterialType.TALENT_147],
    [MaterialType.TALENT_257],
    [MaterialType.TALENT_367],
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
