import {Injectable} from '@angular/core';
import {from, iif, Observable, of, ReplaySubject, zip} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {Weapon} from '../models/weapon.model';
import {PartyWeapon} from '../models/party-weapon.model';
import {first, map, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeaponService {

  #weapons = new ReplaySubject<Weapon[]>(1);

  readonly weapons = this.#weapons.asObservable();

  #party = new ReplaySubject<PartyWeapon[]>(1);

  readonly party = this.#party.asObservable();

  #partyMap = new ReplaySubject<Map<number, PartyWeapon>>(1);

  readonly partyMap = this.#partyMap.asObservable();

  private readonly storeName = 'party-weapons';

  constructor(http: HttpClient, private database: NgxIndexedDBService) {
    http.get<Weapon[]>('assets/data/weapons.json').subscribe(res => this.#weapons.next(res));
    database.getAll(this.storeName).subscribe(party => this.cacheParty(party));
  }

  addPartyMember(weapon: PartyWeapon): Observable<number> {
    const add = this.valid(weapon.id).pipe(switchMap(_ => this.database.add(this.storeName, weapon)));
    return zip(add, this.party).pipe(map(([key, party]) => {
      weapon.key = key;
      const newParty = party.filter(c => c.key !== key);
      newParty.push(weapon);
      this.cacheParty(newParty);
      return key;
    }));
  }

  updatePartyMember(weapon: PartyWeapon): void {
    const key = weapon.key;
    if (!key) {
      return;
    }
    const update = this.valid(weapon.id).pipe(switchMap(_ => this.database.update(this.storeName, weapon)));
    zip(update, this.party).subscribe(([_, party]) => {
      const newParty = party.filter(c => c.key !== key);
      newParty.push(weapon);
      this.cacheParty(newParty);
    });
  }

  removePartyMember(weapon: PartyWeapon): void {
    const key = weapon.key;
    if (!key) {
      return;
    }
    const remove = this.valid(weapon.id).pipe(switchMap(_ => this.database.delete(this.storeName, key)));
    zip(remove, this.party).subscribe(([_, party]) => {
      const newParty = party.filter(c => c.key !== key);
      this.cacheParty(newParty);
    });
  }

  removePartyMemberByList(ids: number[]): void {
    const deleted = from(ids).pipe(switchMap(it => this.database.delete(this.storeName, it)));
    zip(deleted, this.party).subscribe(([_, party]) => {
      const newParty = party.filter(c => !ids.includes(c.key ?? -1));
      this.cacheParty(newParty);
    });
  }

  private cacheParty(party: PartyWeapon[]): void {
    this.#party.next(party);
    const mapped = new Map<number, PartyWeapon>();
    party.forEach(weapon => {
      if (weapon.key) {
        mapped.set(weapon.key, weapon);
      }
    });
    this.#partyMap.next(mapped);
  }

  private valid(id: number): Observable<Weapon> {
    return this.weapons.pipe(
      switchMap(weapons => {
        const list = weapons.filter(c => c.id === id);
        return iif(() => list.length > 0, of(list[0]));
      }),
      first()
    );
  }
}
