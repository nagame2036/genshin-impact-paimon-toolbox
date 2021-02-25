import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Character, CharacterOverview} from '../../models/character.model';
import {I18n} from '../../../widget/models/i18n.model';
import {toggleListItem} from '../../../shared/utils/collections';
import {CharacterService} from '../../services/character.service';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {ImageService} from '../../../image/services/image.service';
import {NGXLogger} from 'ngx-logger';
import {CharacterViewService} from '../../services/character-view.service';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent extends AbstractObservableComponent implements OnChanges {

  readonly i18n = new I18n('characters');

  @Input()
  characters: CharacterOverview[] = [];

  items!: CharacterOverview[];

  @Input()
  selectedItems: Character[] = [];

  @Output()
  selected = new EventEmitter<Character>();

  multiSelect = false;

  @Output()
  multiSelected = new EventEmitter<Character[]>();

  constructor(private service: CharacterService, public view: CharacterViewService,
              public images: ImageService, private logger: NGXLogger) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('characters')) {
      this.logger.info('received characters', this.characters);
      this.update();
    }
  }

  update(): void {
    this.items = this.view.view(this.characters);
    this.logger.info('updated items', this.items);
  }

  select(character: Character): void {
    this.logger.info('selected character', character);
    if (this.multiSelect) {
      this.selectedItems = toggleListItem(this.selectedItems, character, it => it.progress.id === character.progress.id);
      this.multiSelected.emit(this.selectedItems);
    } else {
      this.selected.emit(character);
    }
  }

  onMultiSelectChange({multiSelect, selectAll}: { multiSelect: boolean; selectAll: boolean }): void {
    this.multiSelect = multiSelect;
    this.logger.info('select all', selectAll);
    this.selectedItems = selectAll ? this.characters : [];
    this.multiSelected.emit(this.selectedItems);
  }
}
