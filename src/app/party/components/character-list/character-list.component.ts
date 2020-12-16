import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Character} from '../../../shared/models/character';
import {CharacterService} from '../../../shared/services/character.service';
import alasql from 'alasql';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {PartyCharacter} from '../../../shared/models/party-character';
import {TalentLevel} from '../../../shared/models/talent-level';
import {Constellation} from '../../../shared/models/constellation';
import {Ascension} from '../../../shared/models/ascension.enum';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.sass']
})
export class CharacterListComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.character';

  @Input()
  party = false;

  private readonly sql = 'SELECT * FROM ? ORDER BY rarity DESC, id DESC';

  characters: Character[] = [];

  @Output()
  selected = new EventEmitter<Character>();

  constructor(private characterService: CharacterService) {
    super();
  }

  ngOnInit(): void {
    const characters = this.party ? this.characterService.party : this.characterService.nonParty;
    characters.subscribe(res => this.characters = alasql(this.sql, [res]));
  }

  select(character: Character): void {
    this.selected.emit(character);
  }

  getCharacterLevel(character: Character): number {
    return (character as PartyCharacter)?.level ?? 1;
  }

  getCharacterAscension(character: Character): Ascension {
    return (character as PartyCharacter)?.ascension ?? Ascension.ZERO;
  }

  getCharacterConstellation(character: Character): Constellation {
    return (character as PartyCharacter)?.constellation ?? 0;
  }

  getCharacterTalents(character: Character): TalentLevel[] {
    return (character as PartyCharacter)?.talents ?? [];
  }
}
