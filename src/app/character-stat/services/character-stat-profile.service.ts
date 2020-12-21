import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CharacterStatProfile} from '../models/character-stat-profile.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterStatProfileService {

  #current = new BehaviorSubject(new CharacterStatProfile());

  readonly current = this.#current.asObservable();

  #compared = new BehaviorSubject(new CharacterStatProfile());

  readonly compared = this.#compared.asObservable();

  constructor() {
  }

  setCurrent(value: CharacterStatProfile): void {
    this.#current.next(value);
  }

  setCompared(value: CharacterStatProfile): void {
    this.#compared.next(value);
  }
}
