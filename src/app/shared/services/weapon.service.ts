import {Injectable} from '@angular/core';
import {ReplaySubject, zip} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {Weapon} from '../models/weapon';
import {PartyWeapon} from '../models/party-weapon';
import {Ascension} from '../models/ascension.enum';

@Injectable({
  providedIn: 'root'
})
export class WeaponService {

  #weapons: Weapon[] = [];

  private weaponsSubject = new ReplaySubject<Weapon[]>(1);

  readonly weapons = this.weaponsSubject.asObservable();

  #party: PartyWeapon[] = [];

  private partySubject = new ReplaySubject<PartyWeapon[]>(1);

  readonly party = this.partySubject.asObservable();

  private readonly storeName = 'party-weapons';

  constructor(http: HttpClient, private database: NgxIndexedDBService) {
    http.get<Weapon[]>('assets/data/weapons.json').subscribe(res => {
      this.#weapons = res;
      this.weaponsSubject.next(this.#weapons);
    });
    database.getAll(this.storeName).subscribe(party => {
      this.#party = party;
      this.partySubject.next(this.#party);
    });
  }

  addPartyMember(id: number): void {
    this.changePartyMember(id, (weapon, party) => {
      const newWeapon: PartyWeapon = {...weapon, ascension: Ascension.ZERO, level: 1, refine: 1};
      this.database.add(this.storeName, newWeapon).subscribe(key => {
        newWeapon.key = key;
        this.#party = party.filter(c => c.key !== key);
        this.#party.push(newWeapon);
        this.partySubject.next(this.#party);
      });
    });
  }

  removePartyMember(weapon: PartyWeapon): void {
    this.changePartyMember(weapon.id, (_, party) => {
      const key = weapon.key;
      if (!key) {
        return;
      }
      this.database.delete(this.storeName, key).subscribe(__ => {
        this.#party = party.filter(c => c.key !== key);
        this.partySubject.next(this.#party);
      });
    });
  }

  private changePartyMember(id: number, change: (weapon: Weapon, party: PartyWeapon[]) => void): void {
    zip(this.weapons, this.party).subscribe(([weapons, party]) => {
      const weapon = weapons.filter(c => c.id === id)[0];
      if (weapon) {
        change(weapon, party);
      }
    });
  }
}
