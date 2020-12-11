import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CharacterExpItemsData} from '../models/materials/character-exp-item';
import {WeaponExpItemsData} from '../models/materials/weapon-exp-item';
import {BehaviorSubject} from 'rxjs';
import {OreItemsData} from '../models/materials/ore-item';

@Injectable({
  providedIn: 'root'
})
export class CommonMaterialsService {

  private characterExps$ = new BehaviorSubject<CharacterExpItemsData>({});

  characterExps = this.characterExps$.asObservable();

  private weaponExps$ = new BehaviorSubject<WeaponExpItemsData>({});

  weaponExps = this.weaponExps$.asObservable();

  private ores$ = new BehaviorSubject<OreItemsData>({});

  ores = this.ores$.asObservable();

  constructor(http: HttpClient) {
    http.get('assets/data/character-exp-items.json')
      .subscribe(data => this.characterExps$.next(data as CharacterExpItemsData));
    http.get('assets/data/weapon-exp-items.json')
      .subscribe(data => this.weaponExps$.next(data as WeaponExpItemsData));
    http.get('assets/data/ore-items.json')
      .subscribe(data => this.ores$.next(data as OreItemsData));
  }
}
