import {Injectable} from '@angular/core';
import {from, iif, Observable, of, ReplaySubject, zip} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {Weapon} from '../models/weapon.model';
import {PartyWeapon} from '../models/party-weapon.model';
import {AscensionLevel} from '../models/ascension-level.model';
import {RefineRank} from '../models/refine-rank.type';
import {map, mergeMap} from 'rxjs/operators';

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

  addPartyMember(id: number, level: AscensionLevel, refine: RefineRank): Observable<number> {
    const newWeapon = this.exists(id).pipe(map(weapon => {
      return {...weapon, ascension: level.ascension, level: level.level, refine} as PartyWeapon;
    }));
    const addedKey = newWeapon.pipe(mergeMap(res => this.database.add(this.storeName, res)));
    return zip(this.party, newWeapon, addedKey).pipe(map(([party, weapon, key]) => {
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
    const update = this.exists(weapon.id).pipe(mergeMap(_ => this.database.update(this.storeName, weapon)));
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
    const remove = this.exists(weapon.id).pipe(mergeMap(_ => this.database.delete(this.storeName, key)));
    zip(remove, this.party).subscribe(([_, party]) => {
      const newParty = party.filter(c => c.key !== key);
      this.cacheParty(newParty);
    });
  }

  removePartyMemberByList(ids: number[]): void {
    const deleted = from(ids).pipe(mergeMap(it => this.database.delete(this.storeName, it)));
    zip(deleted, this.party).subscribe(([_, party]) => {
      const newParty = party.filter(c => !ids.includes(c.id));
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

  private exists(id: number): Observable<Weapon> {
    return this.weapons.pipe(mergeMap(weapons => {
      const list = weapons.filter(c => c.id === id);
      return iif(() => list.length > 0, of(list[0]));
    }));
  }
}
