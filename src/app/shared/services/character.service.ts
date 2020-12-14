import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ReplaySubject, zip} from 'rxjs';
import {Character} from '../models/character';
import {NgxIndexedDBService} from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  #characters: Character[] = [];

  private charactersSubject = new ReplaySubject<Character[]>(1);

  readonly characters = this.charactersSubject.asObservable();

  #party: Character[] = [];

  private partySubject = new ReplaySubject<Character[]>(1);

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

  addPartyMember(id: number): void {
    this.changePartyMember(id, (character, party, nonParty) => {
      this.database.update(this.storeName, character).subscribe(_ => {
        this.#party = party.filter(c => c.id !== id);
        this.#party.push(character);
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

  private changePartyMember(id: number, change: (character: Character, party: Character[], nonParty: Character[]) => void): void {
    zip(this.characters, this.party, this.nonParty).subscribe(([characters, party, nonParty]) => {
      const character = characters.filter(c => c.id === id)[0];
      if (character) {
        change(character, party, nonParty);
      }
    });
  }
}
