import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Character} from '../../../shared/models/character';
import {CharacterService} from '../../../shared/services/character.service';
import alasql from 'alasql';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {PartyCharacter} from '../../../shared/models/party-character';

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

  selectCharacter(character: Character): void {
    this.selected.emit(character);
  }

  getCharacterLevel(character: Character): number {
    return (character as PartyCharacter)?.level ?? 1;
  }

  getCharacterAscension(character: Character): number {
    return (character as PartyCharacter)?.ascension ?? 0;
  }

  getCharacterConstellation(character: Character): number {
    return (character as PartyCharacter)?.constellation ?? 0;
  }

  getCharacterTalent(character: Character, talent: number): number {
    const party = character as PartyCharacter;
    switch (talent) {
      case 1:
        return party.talent1;
      case 2:
        return party.talent2;
      case 3:
        return party.talent3;
      default:
        return 0;
    }
  }
}
