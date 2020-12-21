import {Injectable} from '@angular/core';
import {from, ReplaySubject, zip} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {Weapon} from '../models/weapon.model';
import {PartyWeapon} from '../models/party-weapon.model';
import {AscensionLevel} from '../models/ascension-level.model';
import {RefineRank} from '../models/refine-rank.type';
import {mergeMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeaponService {

  #weapons = new ReplaySubject<Weapon[]>(1);

  readonly weapons = this.#weapons.asObservable();

  #party = new ReplaySubject<PartyWeapon[]>(1);

  readonly party = this.#party.asObservable();

  private readonly storeName = 'party-weapons';

  constructor(http: HttpClient, private database: NgxIndexedDBService) {
    http.get<Weapon[]>('assets/data/weapons.json').subscribe(res => this.#weapons.next(res));
    database.getAll(this.storeName).subscribe(party => this.#party.next(party));
  }

  addPartyMember(id: number, level: AscensionLevel, refine: RefineRank): void {
    this.changePartyMember(id, (weapon, party) => {
      const newWeapon: PartyWeapon = {...weapon, ascension: level.ascension, level: level.level, refine};
      this.database.add(this.storeName, newWeapon).subscribe(key => {
        newWeapon.key = key;
        const newParty = party.filter(c => c.key !== key);
        newParty.push(newWeapon);
        this.#party.next(newParty);
      });
    });
  }

  updatePartyMember(weapon: PartyWeapon): void {
    const id = weapon.id;
    this.changePartyMember(id, ((_, party) => {
      this.database.update(this.storeName, weapon).subscribe(__ => {
        const newParty = party.filter(c => c.id !== id);
        newParty.push(weapon);
        this.#party.next(newParty);
      });
    }));
  }

  removePartyMember(weapon: PartyWeapon): void {
    this.changePartyMember(weapon.id, (_, party) => {
      const key = weapon.key;
      if (!key) {
        return;
      }
      this.database.delete(this.storeName, key).subscribe(__ => {
        const newParty = party.filter(c => c.key !== key);
        this.#party.next(newParty);
      });
    });
  }

  removePartyMemberByList(ids: number[]): void {
    const deleted = from(ids).pipe(mergeMap(it => this.database.delete(this.storeName, it)));
    zip(deleted, this.party).subscribe(([_, party]) => {
      const newParty = party.filter(c => !ids.includes(c.id));
      this.#party.next(newParty);
    });
  }

  private changePartyMember(id: number, change: (weapon: Weapon, party: PartyWeapon[]) => void): void {
    zip(this.weapons, this.party).subscribe(([weapons, party]) => {
      weapons.filter(c => c.id === id).forEach(it => change(it, party));
    });
  }
}
