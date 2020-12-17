import {Component, ContentChild, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef} from '@angular/core';
import {Character} from '../../../shared/models/character';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import alasql from 'alasql';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.sass']
})
export class CharacterListComponent extends AbstractTranslateComponent implements OnChanges {

  i18nKey = 'party.character';

  @Input()
  party = false;

  private readonly sql = 'SELECT * FROM ? ORDER BY rarity DESC, id DESC';

  @Input()
  characters: Character[] = [];

  items!: Character[];

  @ContentChild('right', {static: false})
  rightTemplateRef!: TemplateRef<any>;

  @Output()
  selected = new EventEmitter<Character>();

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.items = alasql(this.sql, [this.characters]);
  }
}
