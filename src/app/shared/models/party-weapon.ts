import {Weapon} from './weapon';

export interface PartyWeapon extends Weapon {

  /**
   * Key for persistence.
   */
  key?: number;

  ascension: number;

  level: number;
}
