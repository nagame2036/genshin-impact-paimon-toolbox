import {Component, OnChanges, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {CharacterInfo} from '../../models/character-info.model';
import {ImageService} from '../../../image/services/image.service';
import {NGXLogger} from 'ngx-logger';
import {CharacterService} from '../../services/character.service';
import {CharacterViewService} from '../../services/character-view.service';
import {MaterialDetail} from '../../../material/models/material.model';
import {InfoGridDirective} from '../../../game-common/directives/info-grid.directive';
import {CharacterOverview} from '../../models/character.model';

@Component({
  selector: 'app-character-info-grid',
  templateUrl: './character-info-grid.component.html',
  styleUrls: ['./character-info-grid.component.scss'],
})
export class CharacterInfoGridComponent
  extends InfoGridDirective<CharacterOverview>
  implements OnInit, OnChanges {
  readonly i18n = I18n.create('characters');

  summaryMaterials!: MaterialDetail[];

  constructor(
    public service: CharacterService,
    public images: ImageService,
    view: CharacterViewService,
    logger: NGXLogger,
  ) {
    super(view, logger);
  }

  afterClick(item: CharacterInfo): void {
    this.summaryMaterials = this.service.getRequireMaterials(item);
  }
}
