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
import {toggleItem} from '../../../shared/utils/collections';

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

  elementTypes = elementTypeList;

  elementFilter = this.elementTypes;

  weaponTypes = weaponTypeList;

  weaponFilter = this.weaponTypes;

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
    const rarity = this.rarityFilter.map(i => `rarity = ${i}`).join(' OR ');
    const element = this.elementFilter.map(i => `element = ${i}`).join(' OR ');
    const weapon = this.weaponFilter.map(i => `weapon = ${i}`).join(' OR ');
    const sql = `SELECT * FROM ? WHERE (${rarity}) AND (${element}) AND (${weapon}) ORDER BY ${this.sort} DESC, id DESC`;
    this.items = alasql(sql, [this.characters]);
  }

  changeRarityFilter(change: MatSelectChange): void {
    const value = change.value;
    this.rarityFilter = value.length > 0 ? value : [...this.rarityFilter];
    this.update();
  }

  changeElementFilter(change: MatSelectChange): void {
    const value = change.value;
    this.elementFilter = value.length > 0 ? value : [...this.elementFilter];
    this.update();
  }

  changeWeaponFilter(change: MatSelectChange): void {
    const value = change.value;
    this.weaponFilter = value.length > 0 ? value : [...this.weaponFilter];
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
