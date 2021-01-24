import {Ascension} from '../../game-common/models/ascension.type';

export interface WeaponPlan {

  /**
   * Key of party weapon.
   */
  id: number;

  ascension: Ascension;

  level: number;
}
