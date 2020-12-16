import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ReplaySubject, zip} from 'rxjs';
import {Character} from '../models/character';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {PartyCharacter} from '../models/party-character';
import {Level} from '../models/level';
import {Constellation} from '../models/constellation';
import {TalentLevel} from '../models/talent-level';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  #characters: Character[] = [];

  private charactersSubject = new ReplaySubject<Character[]>(1);

  readonly characters = this.charactersSubject.asObservable();

  #party: PartyCharacter[] = [];

  private partySubject = new ReplaySubject<PartyCharacter[]>(1);

  readonly party = this.partySubject.asObservable();

  #nonParty: Character[] = [];

  private nonPartySubject = new ReplaySubject<Character[]>(1);

  readonly nonParty = this.nonPartySubject.asObservable();

  private readonly storeName = 'party-characters';

  constructor(http: HttpClient, private database: NgxIndexedDBService) {
    http.get<Character[]>('assets/data/characters.json').subscribe(res => {
      this.#characters = res;
      this.charactersSubject.next(this.#characters);
    });
    zip(database.getAll(this.storeName), this.characters).subscribe(([party, characters]) => {
      this.#party = party;
      this.partySubject.next(this.#party);
      const partyIds = party.map(c => c.id);
      this.#nonParty = characters.filter(c => !partyIds.includes(c.id));
      this.nonPartySubject.next(this.#nonParty);
    });
  }

  addPartyMember(id: number, level: Level, constellation: Constellation, talents: TalentLevel[]): void {
    this.changePartyMember(id, (character, party, nonParty) => {
      const newCharacter: PartyCharacter = {...character, ascension: level.ascension, level: level.level, constellation, talents};
      this.database.update(this.storeName, newCharacter).subscribe(_ => {
        this.#party = party.filter(c => c.id !== id);
        this.#party.push(newCharacter);
        this.partySubject.next(this.#party);
        this.#nonParty = nonParty.filter(c => c.id !== id);
        this.nonPartySubject.next(this.#nonParty);
      });
    });
  }

  removePartyMember(id: number): void {
    this.changePartyMember(id, (character, party, nonParty) => {
      this.database.delete(this.storeName, id).subscribe(_ => {
        this.#party = party.filter(c => c.id !== id);
        this.partySubject.next(this.#party);
        this.#nonParty = nonParty.filter(c => c.id !== id);
        this.#nonParty.push(character);
        this.nonPartySubject.next(this.#nonParty);
      });
    });
  }

  private changePartyMember(id: number, change: (character: Character, party: PartyCharacter[], nonParty: Character[]) => void): void {
    zip(this.characters, this.party, this.nonParty).subscribe(([characters, party, nonParty]) => {
      const character = characters.filter(c => c.id === id)[0];
      if (character) {
        change(character, party, nonParty);
      }
    });
  }
}
