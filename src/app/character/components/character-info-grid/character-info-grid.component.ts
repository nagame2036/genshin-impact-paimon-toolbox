import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {CharacterInfo} from '../../models/character-info.model';
import {ImageService} from '../../../image/services/image.service';
import {NGXLogger} from 'ngx-logger';
import {CharacterService} from '../../services/character.service';
import {CharacterViewService} from '../../services/character-view.service';
import {MaterialDetail} from '../../../material/models/material.model';

@Component({
  selector: 'app-character-info-grid',
  templateUrl: './character-info-grid.component.html',
  styleUrls: ['./character-info-grid.component.scss'],
})
export class CharacterInfoGridComponent implements OnChanges {
  readonly i18n = I18n.create('characters');

  @Input()
  characters: CharacterInfo[] = [];

  items!: CharacterInfo[];

  @Input()
  clickText!: string;

  clickedItem: CharacterInfo | null = null;

  clickedItemMaterials!: MaterialDetail[];

  @Input()
  doubleClickText!: string;

  @Output()
  doubleClicked = new EventEmitter<CharacterInfo>();

  constructor(
    public service: CharacterService,
    public view: CharacterViewService,
    public images: ImageService,
    private logger: NGXLogger,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.characters) {
      this.logger.info('received characters', this.characters);
      this.update();
    }
  }

  update(): void {
    this.view.viewInfos(this.characters).subscribe(items => {
      this.items = items;
    });
  }

  click(item: CharacterInfo): void {
    this.logger.info('clicked character', item);
    this.clickedItem = this.clickedItem === item ? null : item;
    if (this.clickedItem) {
      this.clickedItemMaterials = this.service.getRequireMaterials(item);
    }
  }

  doubleClick(item: CharacterInfo): void {
    this.logger.info('double clicked character', item);
    this.doubleClicked.emit(item);
  }
}
