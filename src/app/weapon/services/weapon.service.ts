import {Injectable} from '@angular/core';
import {from, Observable, ReplaySubject, zip} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {Weapon} from '../models/weapon.model';
import {PartyWeapon} from '../models/party-weapon.model';
import {first, map, switchMap, toArray} from 'rxjs/operators';
import {findObservable} from '../../shared/utils/collections';
import {WeaponStatCurve} from '../models/weapon-stat-curve.model';
import {NGXLogger} from 'ngx-logger';

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

  private readonly dataPrefix = 'assets/data/weapons';

  constructor(http: HttpClient, private database: NgxIndexedDBService, private logger: NGXLogger) {
    http.get<Weapon[]>(`${this.dataPrefix}/weapons.json`).subscribe(data => {
      this.logger.info('loaded weapon data', data);
      this.#weapons.next(data);
    });
    database.getAll(this.storeName).subscribe(party => {
      this.logger.info('fetched party weapons from indexed db', party);
      this.cacheParty(party);
    });
  }

  addPartyMember(weapon: PartyWeapon): Observable<number> {
    const add = this.valid(weapon.id).pipe(switchMap(_ => this.database.add(this.storeName, weapon)));
    return zip(add, this.party).pipe(map(([key, party]) => {
      weapon.key = key;
      this.logger.info('added weapon', weapon);
      const newParty = party.filter(c => c.key !== key);
      newParty.push(weapon);
      this.cacheParty(newParty);
      return key;
    }));
  }

  getPartyWeapon(key: number): Observable<PartyWeapon> {
    return this.party.pipe(
      switchMap(party => findObservable(party, it => it.key === key)),
      first()
    );
  }

  updatePartyMember(weapon: PartyWeapon): void {
    const key = weapon.key;
    if (!key) {
      return;
    }
    const update = this.valid(weapon.id).pipe(switchMap(_ => this.database.update(this.storeName, weapon)));
    zip(update, this.party).subscribe(([, party]) => {
      this.logger.info('weapon updated', weapon);
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
      this.logger.info('weapon removed', weapon);
      const newParty = party.filter(c => c.key !== key);
      this.cacheParty(newParty);
    });
  }

  removePartyMemberByList(ids: number[]): void {
    const deleted = from(ids).pipe(
      switchMap(it => this.database.delete(this.storeName, it)),
      toArray(),
    );
    zip(deleted, this.party).subscribe(([_, party]) => {
      this.logger.info('weapons removed', ids);
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
      switchMap(weapons => findObservable(weapons, it => it.id === id)),
      first()
    );
  }
}
