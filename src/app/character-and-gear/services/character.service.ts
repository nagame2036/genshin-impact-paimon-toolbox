import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {from, ReplaySubject, zip} from 'rxjs';
import {Character} from '../models/character.model';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {PartyCharacter} from '../models/party-character.model';
import {AscensionLevel} from '../models/ascension-level.model';
import {Constellation} from '../models/constellation.type';
import {TalentLevelData} from '../models/talent-level-data.model';
import {mergeMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  #characters = new ReplaySubject<Character[]>(1);

  readonly characters = this.#characters.asObservable();

  #party = new ReplaySubject<PartyCharacter[]>(1);

  readonly party = this.#party.asObservable();

  #nonParty = new ReplaySubject<Character[]>(1);

  readonly nonParty = this.#nonParty.asObservable();

  private readonly storeName = 'party-characters';

  constructor(http: HttpClient, private database: NgxIndexedDBService) {
    http.get<Character[]>('assets/data/characters.json').subscribe(res => this.#characters.next(res));
    zip(database.getAll(this.storeName), this.characters).subscribe(([party, characters]) => {
      this.#party.next(party);
      const partyIds = party.map(c => c.id);
      const nonParty = characters.filter(c => !partyIds.includes(c.id));
      this.#nonParty.next(nonParty);
    });
  }

  addPartyMember(id: number, level: AscensionLevel, constellation: Constellation, talents: TalentLevelData[]): void {
    this.changePartyMember(id, (character, party, nonParty) => {
      const newCharacter: PartyCharacter = {...character, ascension: level.ascension, level: level.level, constellation, talents};
      this.database.update(this.storeName, newCharacter).subscribe(_ => {
        const newParty = party.filter(c => c.id !== id);
        newParty.push(newCharacter);
        this.#party.next(newParty);
        const newNonParty = nonParty.filter(c => c.id !== id);
        this.#nonParty.next(newNonParty);
      });
    });
  }

  updatePartyMember(character: PartyCharacter): void {
    const id = character.id;
    this.changePartyMember(id, ((_, party, __) => {
      this.database.update(this.storeName, character).subscribe(___ => {
        const newParty = party.filter(c => c.id !== id);
        newParty.push(character);
        this.#party.next(newParty);
      });
    }));
  }

  removePartyMember(id: number): void {
    this.changePartyMember(id, (character, party, nonParty) => {
      this.database.delete(this.storeName, id).subscribe(_ => {
        const newParty = party.filter(c => c.id !== id);
        this.#party.next(newParty);
        const newNonParty = nonParty.filter(c => c.id !== id);
        newNonParty.push(character);
        this.#nonParty.next(newNonParty);
      });
    });
  }

  removePartyMemberByList(ids: number[]): void {
    const deleted = from(ids).pipe(mergeMap(it => this.database.delete(this.storeName, it)));
    zip(deleted, this.characters, this.party).subscribe(([_, characters, party]) => {
      const newParty = party.filter(c => !ids.includes(c.id));
      this.#party.next(newParty);
      const partyIds = newParty.map(it => it.id);
      const newNonParty = characters.filter(c => !partyIds.includes(c.id));
      this.#nonParty.next(newNonParty);
    });
  }

  private changePartyMember(id: number, change: (character: Character, party: PartyCharacter[], nonParty: Character[]) => void): void {
    zip(this.characters, this.party, this.nonParty).subscribe(([characters, party, nonParty]) => {
      characters.filter(c => c.id === id).forEach(it => change(it, party, nonParty));
    });
  }
}