import {Component, OnChanges, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {WeaponInfo} from '../../models/weapon-info.model';
import {ImageService} from '../../../image/services/image.service';
import {NGXLogger} from 'ngx-logger';
import {WeaponService} from '../../services/weapon.service';
import {WeaponViewService} from '../../services/weapon-view.service';
import {MaterialDetail} from '../../../material/models/material.model';
import {InfoGridDirective} from '../../../game-common/directives/info-grid.directive';
import {WeaponOverview} from '../../models/weapon.model';
import {allRefineRanks} from '../../models/weapon-progress.model';
import {SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'app-weapon-info-grid',
  templateUrl: './weapon-info-grid.component.html',
  styleUrls: ['./weapon-info-grid.component.scss'],
})
export class WeaponInfoGridComponent
  extends InfoGridDirective<WeaponOverview>
  implements OnInit, OnChanges {
  readonly i18n = I18n.create('weapons');

  summaryMaterials!: MaterialDetail[];

  abilityDesc!: SafeHtml;

  constructor(
    public service: WeaponService,
    public images: ImageService,
    view: WeaponViewService,
    logger: NGXLogger,
  ) {
    super(view, logger);
  }

  afterClick(item: WeaponInfo): void {
    this.summaryMaterials = this.service.getRequireMaterials(item);
    this.abilityDesc = this.service.getAbilityDesc(item, ...allRefineRanks);
  }
}
