import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {CharacterOverview} from '../../models/character.model';
import {I18n} from '../../../widget/models/i18n.model';
import {toggleItem} from '../../../shared/utils/collections';
import {CharacterService} from '../../services/character.service';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {ImageService} from '../../../image/services/image.service';
import {NGXLogger} from 'ngx-logger';
import {CharacterViewService} from '../../services/character-view.service';
import {AscensionLevelService} from '../../../game-common/services/ascension-level.service';
import {MaterialDetail} from '../../../material/models/material.model';

@Component({
  selector: 'app-character-grid',
  templateUrl: './character-grid.component.html',
  styleUrls: ['./character-grid.component.scss'],
})
export class CharacterGridComponent
  extends AbstractObservableComponent
  implements OnChanges {
  readonly i18n = I18n.create('characters');

  @Input()
  characters: CharacterOverview[] = [];

  items!: CharacterOverview[];

  @Input()
  clickText!: string;

  clickedItem: CharacterOverview | null = null;

  clickedItemMaterials!: MaterialDetail[];

  @Input()
  selectedItems: CharacterOverview[] = [];

  @Input()
  doubleClickText!: string;

  @Output()
  doubleClicked = new EventEmitter<CharacterOverview>();

  multiSelect = false;

  @Output()
  multiSelected = new EventEmitter<CharacterOverview[]>();

  constructor(
    public service: CharacterService,
    public view: CharacterViewService,
    public level: AscensionLevelService,
    public images: ImageService,
    private logger: NGXLogger,
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.characters) {
      this.logger.info('received characters', this.characters);
      this.update();
    }
  }

  update(): void {
    this.view.view(this.characters).subscribe(items => {
      this.items = items;
    });
  }

  click(item: CharacterOverview): void {
    this.logger.info('clicked character', item);
    if (!this.multiSelect) {
      this.clickedItem = this.clickedItem === item ? null : item;
    } else {
      const origin = this.selectedItems;
      const itemId = item.progress.id;
      const list = toggleItem(origin, item, it => it.progress.id === itemId);
      this.selectedItems = list;
      this.clickedItem = list[list.length - 1] ?? null;
      this.multiSelected.emit(list);
    }
    if (this.clickedItem) {
      const info = this.clickedItem.info;
      this.clickedItemMaterials = this.service.getRequireMaterials(info);
    }
  }

  doubleClick(item: CharacterOverview): void {
    this.logger.info('double clicked character', item);
    this.doubleClicked.emit(item);
  }

  onMultiSelect(event: {multiSelect: boolean; selectAll: boolean}): void {
    this.multiSelect = event.multiSelect;
    this.logger.info('select all', event.selectAll);
    this.selectedItems = event.selectAll ? this.characters : [];
    this.multiSelected.emit(this.selectedItems);
  }
}
