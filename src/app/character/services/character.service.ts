import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {from, Observable, ReplaySubject, zip} from 'rxjs';
import {Character} from '../models/character.model';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {PartyCharacter} from '../models/party-character.model';
import {first, switchMap} from 'rxjs/operators';
import {findObservable} from '../../shared/utils/collections';
import {MaterialRequireMarker} from '../../inventory/services/material-require-marker.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  #characters = new ReplaySubject<Character[]>(1);

  readonly characters = this.#characters.asObservable();

  #party = new ReplaySubject<PartyCharacter[]>(1);

  readonly party = this.#party.asObservable();

  #partyMap = new ReplaySubject<Map<number, PartyCharacter>>(1);

  readonly partyMap = this.#partyMap.asObservable();

  #nonParty = new ReplaySubject<Character[]>(1);

  readonly nonParty = this.#nonParty.asObservable();

  private readonly storeName = 'party-characters';

  constructor(http: HttpClient, private database: NgxIndexedDBService, private marker: MaterialRequireMarker) {
    http.get<Character[]>('assets/data/characters/characters.json').subscribe(res => this.#characters.next(res));
    zip(database.getAll(this.storeName), this.characters).subscribe(([party, characters]) => {
      this.cacheParty(party);
      const partyIds = party.map(c => c.id);
      const nonParty = characters.filter(c => !partyIds.includes(c.id));
      this.#nonParty.next(nonParty);
    });
  }

  addPartyMember(character: PartyCharacter): void {
    const id = character.id;
    const add = this.valid(id).pipe(switchMap(_ => this.database.add(this.storeName, character)));
    zip(add, this.party, this.nonParty).subscribe(([_, party, nonParty]) => {
      const newParty = party.filter(c => c.id !== id);
      newParty.push(character);
      this.cacheParty(newParty);
      const newNonParty = nonParty.filter(c => c.id !== id);
      this.#nonParty.next(newNonParty);
    });
  }

  getPartyCharacter(id: number): Observable<PartyCharacter> {
    return this.party.pipe(
      switchMap(party => findObservable(party, it => it.id === id)),
      first()
    );
  }

  updatePartyMember(character: PartyCharacter): void {
    const id = character.id;
    const update = this.valid(id).pipe(switchMap(_ => this.database.update(this.storeName, character)));
    zip(update, this.party).subscribe(([_, party]) => {
      const newParty = party.filter(c => c.id !== id);
      newParty.push(character);
      this.cacheParty(newParty);
    });
  }

  removePartyMember(id: number): void {
    const valid = this.valid(id);
    const remove = valid.pipe(switchMap(_ => this.database.delete(this.storeName, id)));
    zip(remove, this.party, this.nonParty, valid).subscribe(([_, party, nonParty, character]) => {
      const newParty = party.filter(c => c.id !== id);
      this.cacheParty(newParty);
      const newNonParty = nonParty.filter(c => c.id !== id);
      newNonParty.push(character);
      this.#nonParty.next(newNonParty);
    });
  }

  removePartyMemberByList(ids: number[]): void {
    const deleted = from(ids).pipe(switchMap(it => this.database.delete(this.storeName, it)));
    zip(deleted, this.characters, this.party).subscribe(([_, characters, party]) => {
      const newParty = party.filter(c => !ids.includes(c.id));
      this.cacheParty(newParty);
      const partyIds = newParty.map(it => it.id);
      const newNonParty = characters.filter(c => !partyIds.includes(c.id));
      this.#nonParty.next(newNonParty);
    });
  }

  private cacheParty(party: PartyCharacter[]): void {
    this.#party.next(party);
    const mapped = new Map<number, PartyCharacter>();
    party.forEach(character => mapped.set(character.id, character));
    this.#partyMap.next(mapped);
  }

  private valid(id: number): Observable<Character> {
    return this.characters.pipe(
      switchMap(characters => findObservable(characters, it => it.id === id)),
      first()
    );
  }
}
