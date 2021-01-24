import {Component, ContentChild, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef} from '@angular/core';
import {Character} from '../../models/character.model';
import {I18n} from '../../../shared/models/i18n.model';
import {ElementType, elementTypeList} from '../../../shared/models/element-type.enum';
import {WeaponType, weaponTypeList} from '../../../weapon/models/weapon-type.enum';
import {toggleItem} from '../../../shared/utils/collections';
import {CharacterField} from '../../models/character-field.type';
import {PartyCharacter} from '../../models/party-character.model';
import {ImageService} from '../../../image/services/image.service';
import {SelectOption} from '../../../shared/models/select-option.model';

const characterRarities = [5, 4];

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnChanges {

  i18n = new I18n('characters');

  @Input()
  party = false;

  @Input()
  itemWidth = 102;

  @Input()
  characters: Character[] = [];

  items!: Character[];

  @ContentChild('right', {static: false})
  rightTemplateRef!: TemplateRef<any>;

  @Input()
  multiSelect = false;

  @Input()
  selectedItems: Character[] = [];

  @Output()
  selected = new EventEmitter<Character>();

  @Output()
  multiSelected = new EventEmitter<Character[]>();

  @Input()
  sortFields: CharacterField[] = ['rarity'];

  sorts: SelectOption[] = this.sortFields.map(it => ({value: it, text: this.i18n.dict(it)}));

  @Input()
  sort: CharacterField = 'rarity';

  rarities = characterRarities.map(it => ({value: it, text: `★${it}`}));

  rarityFilter = characterRarities;

  elements = elementTypeList.map(it => ({value: it, text: this.i18n.dict(`elements.${it}`)}));

  elementFilter = elementTypeList;

  weapons = weaponTypeList.map(it => ({value: it, text: this.i18n.dict(`weapon-types.${it}`)}));

  weaponFilter = weaponTypeList;

  constructor(public images: ImageService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('sortFields')) {
      this.sorts = changes.sortFields.currentValue.map((it: string) => ({value: it, text: this.i18n.dict(it)}));
    }
    if (changes.hasOwnProperty('characters')) {
      this.update();
    }
  }

  update(): void {
    if (!this.multiSelect) {
      this.selectedItems = [];
      this.multiSelected.emit([]);
    }
    this.items = this.characters.map(it => it as PartyCharacter)
      .filter(it => this.rarityFilter.includes(it.rarity) && this.elementFilter.includes(it.element)
        && this.weaponFilter.includes(it.weapon))
      .sort((a, b) => b[this.sort] - a[this.sort] || b.id - a.id);
  }

  changeSort(sort: CharacterField): void {
    this.sort = sort;
    this.update();
  }

  filterRarity(value: number[]): void {
    this.rarityFilter = value;
    this.update();
  }

  filterElement(value: ElementType[]): void {
    this.elementFilter = value;
    this.update();
  }

  filterWeapon(value: WeaponType[]): void {
    this.weaponFilter = value;
    this.update();
  }

  select(item: Character): void {
    this.multiSelect ? this.onMultiSelect(item) : this.selected.emit(item);
  }

  onMultiSelect(item: Character): void {
    this.selectedItems = toggleItem(this.selectedItems, item);
    this.multiSelected.emit(this.selectedItems);
  }

  selectAll(checked: boolean): void {
    this.selectedItems = checked ? this.items : [];
    this.multiSelected.emit(this.selectedItems);
  }
}
