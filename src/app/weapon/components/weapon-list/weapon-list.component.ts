import {Component, ContentChild, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef} from '@angular/core';
import {Weapon} from '../../models/weapon.model';
import {I18n} from '../../../widget/models/i18n.model';
import {WeaponType, weaponTypeList} from '../../models/weapon-type.enum';
import {toggleItem} from '../../../shared/utils/collections';
import {WeaponField} from '../../models/weapon-fields.type';
import {PartyWeapon} from '../../models/party-weapon.model';
import {ImageService} from '../../../image/services/image.service';
import {SelectOption} from '../../../widget/models/select-option.model';

const weaponRarities = [5, 4, 3];

@Component({
  selector: 'app-weapon-list',
  templateUrl: './weapon-list.component.html',
  styleUrls: ['./weapon-list.component.scss']
})
export class WeaponListComponent implements OnChanges {

  i18n = new I18n('weapons');

  @Input()
  party = false;

  @Input()
  itemWidth = 102;

  @Input()
  weapons: Weapon[] = [];

  items!: Weapon[];

  @ContentChild('right', {static: false})
  rightTemplateRef!: TemplateRef<any>;

  @Input()
  multiSelect = false;

  @Input()
  selectedItems: Weapon[] = [];

  @Output()
  selected = new EventEmitter<Weapon>();

  @Output()
  multiSelected = new EventEmitter<Weapon[]>();

  @Input()
  sortFields: WeaponField[] = ['rarity'];

  sorts: SelectOption[] = this.sortFields.map(it => ({value: it, text: this.i18n.dict(it)}));

  @Input()
  sort: WeaponField = 'rarity';

  rarities = weaponRarities.map(it => ({value: it, text: `★${it}`}));

  rarityFilter = weaponRarities;

  types = weaponTypeList.map(it => ({value: it, text: this.i18n.dict(`weapon-types.${it}`)}));

  typeFilter = weaponTypeList;

  constructor(public images: ImageService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('sortFields')) {
      this.sorts = changes.sortFields.currentValue.map((it: string) => ({value: it, text: this.i18n.dict(it)}));
    }
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
      .sort((a, b) => b[this.sort] - a[this.sort] || a.type - b.type || b.id - a.id);
  }

  changeSort(sort: WeaponField): void {
    this.sort = sort;
    this.update();
  }

  filterRarity(value: number[]): void {
    this.rarityFilter = value;
    this.update();
  }

  filterType(value: WeaponType[]): void {
    this.typeFilter = value;
    this.update();
  }

  select(item: Weapon): void {
    this.multiSelect ? this.onMultiSelect(item) : this.selected.emit(item);
  }

  onMultiSelect(item: Weapon): void {
    if (this.party) {
      const partyKey = (item as PartyWeapon).key ?? -1;
      this.selectedItems = toggleItem(this.selectedItems, item, it => ((it as PartyWeapon).key ?? -1) === partyKey);
    } else {
      this.selectedItems = toggleItem(this.selectedItems, item);
    }
    this.multiSelected.emit(this.selectedItems);
  }

  selectAll(checked: boolean): void {
    this.selectedItems = checked ? this.items : [];
    this.multiSelected.emit(this.selectedItems);
  }
}
