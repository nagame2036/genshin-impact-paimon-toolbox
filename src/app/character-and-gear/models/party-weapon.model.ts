import {Weapon} from './weapon.model';
import {Ascension} from './ascension.enum';
import {RefineRank} from './refine-rank.type';

export interface PartyWeapon extends Weapon {

  /**
   * Key for persistence.
   */
  key?: number;

  ascension: Ascension;

  level: number;

  refine: RefineRank;
}
