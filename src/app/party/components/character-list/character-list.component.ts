import {Component, ContentChild, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef} from '@angular/core';
import {Character} from '../../../shared/models/character';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import alasql from 'alasql';
import {ElementType} from '../../../shared/models/element-type.enum';
import {WeaponType} from '../../../shared/models/weapon-type.enum';
import {MatSelectChange} from '@angular/material/select';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.sass']
})
export class CharacterListComponent extends AbstractTranslateComponent implements OnChanges {

  i18nKey = 'party.character';

  @Input()
  party = false;

  @Input()
  characters: Character[] = [];

  items!: Character[];

  @ContentChild('right', {static: false})
  rightTemplateRef!: TemplateRef<any>;

  @Output()
  selected = new EventEmitter<Character>();

  @Input()
  sortFields = ['rarity'];

  @Input()
  sort = 'rarity';

  elementTypes = [ElementType.ANEMO, ElementType.GEO, ElementType.ELECTRO, ElementType.HYDRO, ElementType.PYRO, ElementType.CRYO];

  elementFilter = this.elementTypes;

  weaponTypes = [WeaponType.SWORD, WeaponType.CLAYMORE, WeaponType.CATALYST, WeaponType.BOW, WeaponType.POLEARM];

  weaponFilter = this.weaponTypes;

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  update(): void {
    const element = this.elementFilter.map(i => `element = ${i}`).join(' OR ');
    const weapon = this.weaponFilter.map(i => `weapon = ${i}`).join(' OR ');
    const sql = `SELECT * FROM ? items WHERE (${element}) AND (${weapon}) ORDER BY ${this.sort} DESC, id DESC`;
    this.items = alasql(sql, [this.characters]);
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
}
