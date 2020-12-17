import {Component, ContentChild, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef} from '@angular/core';
import alasql from 'alasql';
import {Weapon} from '../../../shared/models/weapon';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {WeaponType} from '../../../shared/models/weapon-type.enum';
import {MatSelectChange} from '@angular/material/select';

@Component({
  selector: 'app-weapon-list',
  templateUrl: './weapon-list.component.html',
  styleUrls: ['./weapon-list.component.sass']
})
export class WeaponListComponent extends AbstractTranslateComponent implements OnChanges {

  i18nKey = 'party.weapon';

  @Input()
  party = false;

  @Input()
  weapons: Weapon[] = [];

  items!: Weapon[];

  @ContentChild('right', {static: false})
  rightTemplateRef!: TemplateRef<any>;

  @Output()
  selected = new EventEmitter<Weapon>();

  sortFields = ['level', 'rarity'];

  sort = 'level';

  types = [WeaponType.SWORD, WeaponType.CLAYMORE, WeaponType.CATALYST, WeaponType.BOW, WeaponType.POLEARM];

  typeFilter = this.types;

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  update(): void {
    const type = this.typeFilter.map(i => `type = ${i}`).join(' OR ');
    const sql = `SELECT * FROM ? items WHERE ${type} ORDER BY ${this.sort} DESC, id DESC`;
    this.items = alasql(sql, [this.weapons]);
  }

  changeTypeFilter(change: MatSelectChange): void {
    const value = change.value;
    this.typeFilter = value.length > 0 ? value : [...this.typeFilter];
    this.update();
  }
}
