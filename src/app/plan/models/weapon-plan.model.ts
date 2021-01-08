import {Ascension} from '../../character-and-gear/models/ascension.type';

export interface WeaponPlan {

  /**
   * Key of party weapon.
   */
  id: number;

  ascension: Ascension;

  level: number;
}
