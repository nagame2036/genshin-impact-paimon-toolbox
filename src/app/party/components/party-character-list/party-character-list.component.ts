import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Character} from '../../../shared/models/character';
import {PartyCharacter} from '../../../shared/models/party-character';
import {Ascension} from '../../../shared/models/ascension.enum';
import {Constellation} from '../../../shared/models/constellation';
import {TalentLevel} from '../../../shared/models/talent-level';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {CharacterService} from '../../../shared/services/character.service';

@Component({
  selector: 'app-party-character-list',
  templateUrl: './party-character-list.component.html',
  styleUrls: ['./party-character-list.component.sass']
})
export class PartyCharacterListComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party.character';

  characters: Character[] = [];

  @Output()
  selected = new EventEmitter<Character>();

  @Output()
  create = new EventEmitter();

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
    return (item as PartyCharacter)?.talents ?? [1, 1, 1];
  }
}