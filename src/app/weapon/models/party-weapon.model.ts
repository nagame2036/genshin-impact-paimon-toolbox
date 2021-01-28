import {Weapon} from './weapon.model';
import {Ascension} from '../../game-common/models/ascension.type';
import {RefineRank} from './refine-rank.type';

export interface PartyWeapon extends Weapon {

  /**
   * Key for persistence.
   */
  key?: number;

  refine: RefineRank;

  ascension: Ascension;

  level: number;

  atk: number;

  subStat: number;
}
