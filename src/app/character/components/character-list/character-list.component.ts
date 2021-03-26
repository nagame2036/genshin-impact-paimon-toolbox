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
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss'],
})
export class CharacterListComponent
  extends AbstractObservableComponent
  implements OnChanges {
  readonly i18n = new I18n('characters');

  @Input()
  characters: CharacterOverview[] = [];

  items!: CharacterOverview[];

  clickedItem: CharacterOverview | null = null;

  clickedItemMaterials!: MaterialDetail[];

  @Input()
  selectedItems: CharacterOverview[] = [];

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
    if (changes.hasOwnProperty('characters')) {
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

  onMultiSelectChange(event: {multiSelect: boolean; selectAll: boolean}): void {
    const {multiSelect, selectAll} = event;
    this.multiSelect = multiSelect;
    this.logger.info('select all', selectAll);
    this.selectedItems = selectAll ? this.characters : [];
    this.multiSelected.emit(this.selectedItems);
  }
}
