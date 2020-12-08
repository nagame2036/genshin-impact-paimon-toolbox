import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CharacterStatProfile} from './character-stat-profile';

@Injectable({
  providedIn: 'root'
})
export class CharacterStatProfileService {

  private currentField = new BehaviorSubject(new CharacterStatProfile());

  readonly current = this.currentField.asObservable();

  private comparedField = new BehaviorSubject(new CharacterStatProfile());

  readonly compared = this.comparedField.asObservable();

  constructor() {
  }

  setCurrent(value: CharacterStatProfile): void {
    this.currentField.next(value);
  }

  setCompared(value: CharacterStatProfile): void {
    this.comparedField.next(value);
  }
}
