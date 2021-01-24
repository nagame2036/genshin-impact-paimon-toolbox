import {Weapon} from './weapon.model';
import {Ascension} from '../../game-common/models/ascension.type';
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
