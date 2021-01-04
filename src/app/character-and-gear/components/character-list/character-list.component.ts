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
import alasql from 'alasql';
import {elementTypeList} from '../../../shared/models/element-type.enum';
import {weaponTypeList} from '../../models/weapon-type.enum';
import {MatSelectChange} from '@angular/material/select';
import {ItemViewComponent} from '../../../shared/components/item-view/item-view.component';
import {ensureAtLeastOneElement, toggleItem} from '../../../shared/utils/collections';

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
  sortFields = ['rarity'];

  @Input()
  sort = 'rarity';

  rarities = [5, 4];

  rarityFilter = this.rarities;

  rarityWhere = 'TRUE';

  elementTypes = elementTypeList;

  elementFilter = this.elementTypes;

  elementWhere = 'TRUE';

  weaponTypes = weaponTypeList;

  weaponFilter = this.weaponTypes;

  weaponWhere = 'TRUE';

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  update(): void {
    if (!this.multiSelect) {
      this.selectedItems = [];
      this.multiSelected.emit([]);
    }
    const where = `(${this.rarityWhere}) AND (${this.elementWhere}) AND (${this.weaponWhere})`;
    const sql = `SELECT * FROM ? WHERE ${where} ORDER BY ${this.sort} DESC, id DESC`;
    this.items = alasql(sql, [this.characters]);
  }

  changeRarityFilter(change: MatSelectChange): void {
    this.rarityFilter = ensureAtLeastOneElement(this.rarityFilter, change.value);
    this.rarityWhere = this.rarityFilter.map(i => `rarity = ${i}`).join(' OR ');
    this.update();
  }

  changeElementFilter(change: MatSelectChange): void {
    this.elementFilter = ensureAtLeastOneElement(this.elementFilter, change.value);
    this.elementWhere = this.elementFilter.map(i => `element = ${i}`).join(' OR ');
    this.update();
  }

  changeWeaponFilter(change: MatSelectChange): void {
    this.weaponFilter = ensureAtLeastOneElement(this.weaponFilter, change.value);
    this.weaponWhere = this.weaponFilter.map(i => `weapon = ${i}`).join(' OR ');
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
