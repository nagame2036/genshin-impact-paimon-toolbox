import {Weapon} from './weapon';
import {Ascension} from './ascension.enum';
import {RefineRank} from './refine-rank';

export interface PartyWeapon extends Weapon {

  /**
   * Key for persistence.
   */
  key?: number;

  ascension: Ascension;

  level: number;

  refine: RefineRank;
}
