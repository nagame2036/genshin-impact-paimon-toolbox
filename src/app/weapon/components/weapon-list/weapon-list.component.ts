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
import {Weapon} from '../../models/weapon.model';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {weaponTypeList} from '../../models/weapon-type.enum';
import {MatSelectChange} from '@angular/material/select';
import {ItemViewComponent} from '../../../shared/components/item-view/item-view.component';
import {ensureAtLeastOneElement, toggleItem} from '../../../shared/utils/collections';
import {WeaponFields} from '../../models/weapon-fields.type';
import {PartyWeapon} from '../../models/party-weapon.model';

@Component({
  selector: 'app-weapon-list',
  templateUrl: './weapon-list.component.html',
  styleUrls: ['./weapon-list.component.scss']
})
export class WeaponListComponent extends AbstractTranslateComponent implements OnChanges {

  i18nKey = 'weapons';

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
  sortFields: WeaponFields[] = ['rarity'];

  @Input()
  sort: WeaponFields = 'rarity';

  rarities = [5, 4, 3];

  rarityFilter = this.rarities;

  types = weaponTypeList;

  typeFilter = this.types;

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('weapons')) {
      this.update();
    }
  }

  update(): void {
    if (!this.multiSelect) {
      this.selectedItems = [];
      this.multiSelected.emit([]);
    }
    this.items = this.weapons.map(it => it as PartyWeapon)
      .filter(it => this.rarityFilter.includes(it.rarity) && this.typeFilter.includes(it.type))
      .sort((a, b) => b[this.sort] - a[this.sort] || b.id - a.id);
  }

  changeRarityFilter(change: MatSelectChange): void {
    this.rarityFilter = ensureAtLeastOneElement(this.rarityFilter, change.value);
    this.update();
  }

  changeTypeFilter(change: MatSelectChange): void {
    this.typeFilter = ensureAtLeastOneElement(this.typeFilter, change.value);
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
