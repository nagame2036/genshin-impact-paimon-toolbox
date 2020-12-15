import {Character} from './character';
import {Ascension} from './ascension.enum';

export interface PartyCharacter extends Character {

  ascension: Ascension;

  level: number;

  constellation: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  talent1: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  talent2: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  talent3: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}
