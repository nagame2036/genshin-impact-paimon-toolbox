import {Component, ContentChild, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef} from '@angular/core';
import alasql from 'alasql';
import {Weapon} from '../../../shared/models/weapon';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';

@Component({
  selector: 'app-weapon-list',
  templateUrl: './weapon-list.component.html',
  styleUrls: ['./weapon-list.component.sass']
})
export class WeaponListComponent extends AbstractTranslateComponent implements OnChanges {

  i18nKey = 'party.weapon';

  @Input()
  party = false;

  private readonly sql = 'SELECT * FROM ? ORDER BY rarity DESC, type, id DESC';

  @Input()
  weapons: Weapon[] = [];

  items!: Weapon[];

  @ContentChild('right', {static: false})
  rightTemplateRef!: TemplateRef<any>;

  @Output()
  selected = new EventEmitter<Weapon>();

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.items = alasql(this.sql, [this.weapons]);
  }
}
