import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Character} from '../../models/character.model';
import {I18n} from '../../../widget/models/i18n.model';
import {ElementType} from '../../../game-common/models/element-type.enum';
import {WeaponType} from '../../../weapon/models/weapon-type.enum';
import {toggleListItem} from '../../../shared/utils/collections';
import {CharacterService} from '../../services/character.service';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {ImageService} from '../../../image/services/image.service';
import {NGXLogger} from 'ngx-logger';
import {Rarity} from '../../../game-common/models/rarity.type';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent extends AbstractObservableComponent implements OnChanges {

  readonly i18n = new I18n('characters');

  @Input()
  characters: Character[] = [];

  items!: Character[];

  @Input()
  selectedItems: Character[] = [];

  @Output()
  selected = new EventEmitter<Character>();

  multiSelect = false;

  @Output()
  multiSelected = new EventEmitter<Character[]>();

  @Output()
  add = new EventEmitter();

  constructor(public service: CharacterService, public images: ImageService, private logger: NGXLogger) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('characters')) {
      this.logger.info('received characters', this.characters);
      this.update();
    }
  }

  update(): void {
    this.items = this.service.view(this.characters);
    this.logger.info('updated items', this.items);
  }

  changeSort(sort: (a: Character, b: Character) => number): void {
    this.service.sort = sort;
    this.logger.info('updated sort', this.service.sorts.find(it => it.value === sort)?.text);
    this.update();
  }

  filterRarity(value: Rarity[]): void {
    this.service.rarityFilter = value;
    this.logger.info('updated rarityFilter', value);
    this.update();
  }

  filterElement(value: ElementType[]): void {
    this.service.elementFilter = value;
    this.logger.info('updated elementFilter', value);
    this.update();
  }

  filterWeapon(value: WeaponType[]): void {
    this.service.weaponFilter = value;
    this.logger.info('updated weaponFilter', value);
    this.update();
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
