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
import alasql from 'alasql';
import {Weapon} from '../../models/weapon.model';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {weaponTypeList} from '../../models/weapon-type.enum';
import {MatSelectChange} from '@angular/material/select';
import {ItemViewComponent} from '../../../shared/components/item-view/item-view.component';
import {toggleItem} from '../../../shared/utils/collections';

@Component({
  selector: 'app-weapon-list',
  templateUrl: './weapon-list.component.html',
  styleUrls: ['./weapon-list.component.sass']
})
export class WeaponListComponent extends AbstractTranslateComponent implements OnChanges {

  i18nKey = 'party.weapons';

  @Input()
  party = false;

  @Input()
  itemWidth = 100;

  @Input()
  weapons: Weapon[] = [];

  items!: Weapon[];

  @ContentChild('right', {static: false})
  rightTemplateRef!: TemplateRef<any>;

  @Input()
  multiSelect = false;

  private selectedItems: Weapon[] = [];

  @Output()
  selected = new EventEmitter<Weapon>();

  @Output()
  multiSelected = new EventEmitter<Weapon[]>();

  @ViewChildren('list')
  list!: QueryList<ItemViewComponent>;

  @Input()
  sortFields = ['rarity'];

  @Input()
  sort = 'rarity';

  rarities = [5, 4, 3];

  rarityFilter = this.rarities;

  types = weaponTypeList;

  typeFilter = this.types;

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
    const type = this.typeFilter.map(i => `type = ${i}`).join(' OR ');
    const sql = `SELECT * FROM ? WHERE (${rarity}) AND (${type}) ORDER BY ${this.sort} DESC, type, id DESC`;
    this.items = alasql(sql, [this.weapons]);
  }

  changeRarityFilter(change: MatSelectChange): void {
    const value = change.value;
    this.rarityFilter = value.length > 0 ? value : [...this.rarityFilter];
    this.update();
  }

  changeTypeFilter(change: MatSelectChange): void {
    const value = change.value;
    this.typeFilter = value.length > 0 ? value : [...this.typeFilter];
    this.update();
  }

  select(item: Weapon): void {
    this.multiSelect ? this.onMultiSelect(item) : this.selected.emit(item);
  }

  onMultiSelect(item: Weapon): void {
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
