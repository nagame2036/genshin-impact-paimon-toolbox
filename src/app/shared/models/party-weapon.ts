import {Weapon} from './weapon';
import {Ascension} from './ascension.enum';

export interface PartyWeapon extends Weapon {

  /**
   * Key for persistence.
   */
  key?: number;

  ascension: Ascension;

  level: number;

  /**
   * Refine rank.
   */
  refine: 1 | 2 | 3 | 4 | 5;
}
