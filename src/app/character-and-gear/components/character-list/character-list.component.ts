import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChildren
} from '@angular/core';
import {Character} from '../../models/character.model';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {elementTypeList} from '../../../shared/models/element-type.enum';
import {weaponTypeList} from '../../models/weapon-type.enum';
import {MatSelectChange} from '@angular/material/select';
import {ItemViewComponent} from '../../../shared/components/item-view/item-view.component';
import {ensureAtLeastOneElement, toggleItem} from '../../../shared/utils/collections';
import {CharacterFields} from '../../models/character-fields.model';
import {PartyCharacter} from '../../models/party-character.model';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.sass']
})
export class CharacterListComponent extends AbstractTranslateComponent implements OnChanges {

  i18nKey = 'party.characters';

  @Input()
  party = false;

  @Input()
  itemWidth = 100;

  @Input()
  characters: Character[] = [];

  items!: Character[];

  @ContentChild('right', {static: false})
  rightTemplateRef!: TemplateRef<any>;

  @Input()
  multiSelect = false;

  private selectedItems: Character[] = [];

  @Output()
  selected = new EventEmitter<Character>();

  @Output()
  multiSelected = new EventEmitter<Character[]>();

  @ViewChildren('list')
  list!: QueryList<ItemViewComponent>;

  @Input()
  sortFields: CharacterFields[] = ['rarity'];

  @Input()
  sort: CharacterFields = 'rarity';

  rarities = [5, 4];

  rarityFilter = this.rarities;

  elementTypes = elementTypeList;

  elementFilter = this.elementTypes;

  weaponTypes = weaponTypeList;

  weaponFilter = this.weaponTypes;

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
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

  changeRarityFilter(change: MatSelectChange): void {
    this.rarityFilter = ensureAtLeastOneElement(this.rarityFilter, change.value);
    this.update();
  }

  changeElementFilter(change: MatSelectChange): void {
    this.elementFilter = ensureAtLeastOneElement(this.elementFilter, change.value);
    this.update();
  }

  changeWeaponFilter(change: MatSelectChange): void {
    this.weaponFilter = ensureAtLeastOneElement(this.weaponFilter, change.value);
    this.update();
  }

  select(item: Character): void {
    this.multiSelect ? this.onMultiSelect(item) : this.selected.emit(item);
  }

  onMultiSelect(item: Character): void {
    this.selectedItems = toggleItem(this.selectedItems, item);
    this.multiSelected.emit(this.selectedItems);
    this.list.filter(it => it.id === item.id).forEach(it => it.active = !it.active);
  }

  selectAll(checked: boolean): void {
    this.selectedItems = checked ? this.items : [];
    this.list.forEach(it => it.active = checked);
    this.multiSelected.emit(this.selectedItems);
  }
}
