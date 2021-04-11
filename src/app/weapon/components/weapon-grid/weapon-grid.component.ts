import {Component} from '@angular/core';
import {WeaponOverview} from '../../models/weapon.model';
import {I18n} from '../../../widget/models/i18n.model';
import {WeaponService} from '../../services/weapon.service';
import {ImageService} from '../../../image/services/image.service';
import {WeaponViewService} from '../../services/weapon-view.service';
import {AscensionLevelService} from '../../../game-common/services/ascension-level.service';
import {MaterialDetail} from '../../../material/models/material.model';
import {ItemGridDirective} from '../../../game-common/directives/item-grid.directive';

@Component({
  selector: 'app-weapon-grid',
  templateUrl: './weapon-grid.component.html',
  styleUrls: ['./weapon-grid.component.scss'],
})
export class WeaponGridComponent extends ItemGridDirective<WeaponOverview> {
  i18n = I18n.create('weapons');

  summaryMaterials!: MaterialDetail[];

  constructor(
    public service: WeaponService,
    public level: AscensionLevelService,
    public images: ImageService,
    view: WeaponViewService,
  ) {
    super(view);
  }

  afterClick(item: WeaponOverview): void {
    this.summaryMaterials = this.service.getRequireMaterials(item.info);
  }
}
