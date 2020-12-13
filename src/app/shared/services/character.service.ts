import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ReplaySubject} from 'rxjs';
import {Character} from '../models/character';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  #characters: Character[] = [];

  private charactersSubject = new ReplaySubject<Character[]>(1);

  readonly characters = this.charactersSubject.asObservable();

  constructor(http: HttpClient) {
    http.get<Character[]>('assets/data/characters.json').subscribe(res => {
      this.#characters = res;
      this.charactersSubject.next(this.#characters);
    });
  }
}
