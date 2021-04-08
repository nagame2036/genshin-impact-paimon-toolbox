import {Component} from '@angular/core';
import {CharacterOverview} from '../../models/character.model';
import {I18n} from '../../../widget/models/i18n.model';
import {CharacterService} from '../../services/character.service';
import {ImageService} from '../../../image/services/image.service';
import {NGXLogger} from 'ngx-logger';
import {CharacterViewService} from '../../services/character-view.service';
import {AscensionLevelService} from '../../../game-common/services/ascension-level.service';
import {MaterialDetail} from '../../../material/models/material.model';
import {ItemGridDirective} from '../../../game-common/directives/item-grid.directive';

@Component({
  selector: 'app-character-grid',
  templateUrl: './character-grid.component.html',
  styleUrls: ['./character-grid.component.scss'],
})
export class CharacterGridComponent extends ItemGridDirective<CharacterOverview> {
  readonly i18n = I18n.create('characters');

  summaryMaterials!: MaterialDetail[];

  constructor(
    public service: CharacterService,
    public level: AscensionLevelService,
    public images: ImageService,
    view: CharacterViewService,
    logger: NGXLogger,
  ) {
    super(view, logger);
  }

  protected afterClick(item: CharacterOverview): void {
    this.summaryMaterials = this.service.getRequireMaterials(item.info);
  }
}
