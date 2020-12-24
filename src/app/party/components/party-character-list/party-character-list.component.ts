import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Character} from '../../../character-and-gear/models/character.model';
import {PartyCharacter} from '../../../character-and-gear/models/party-character.model';
import {Ascension} from '../../../character-and-gear/models/ascension.enum';
import {Constellation} from '../../../character-and-gear/models/constellation.type';
import {TalentLevel} from '../../../character-and-gear/models/talent-level.type';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {CharacterService} from '../../../character-and-gear/services/character.service';
import {CharacterListComponent} from '../../../character-and-gear/components/character-list/character-list.component';

@Component({
  selector: 'app-party-character-list',
  templateUrl: './party-character-list.component.html',
  styleUrls: ['./party-character-list.component.sass']
})
export class PartyCharacterListComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.characters';

  characters: Character[] = [];

  @Output()
  selected = new EventEmitter<Character>();

  @Output()
  multiSelected = new EventEmitter<Character[]>();

  @Output()
  create = new EventEmitter();

  @ViewChild('list')
  list!: CharacterListComponent;

  constructor(private service: CharacterService) {
    super();
  }

  ngOnInit(): void {
    this.service.party.subscribe(res => this.characters = res);
  }

  getAscension(item: Character): Ascension {
    return (item as PartyCharacter)?.ascension ?? Ascension.ZERO;
  }

  getLevel(item: Character): number {
    return (item as PartyCharacter)?.level ?? 1;
  }

  getConstellation(item: Character): Constellation {
    return (item as PartyCharacter)?.constellation ?? 0;
  }

  getTalents(item: Character): TalentLevel[] {
    return (item as PartyCharacter)?.talents.map(it => it.level) ?? [1, 1, 1];
  }

  onMultiSelectChange(event: { multiSelect: boolean; selectAll: boolean }): void {
    this.list.multiSelect = event.multiSelect;
    this.list.selectAll(event.selectAll);
  }
}
