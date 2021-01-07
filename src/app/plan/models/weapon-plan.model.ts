import {Ascension} from '../../character-and-gear/models/ascension.enum';

export interface WeaponPlan {

  /**
   * Key of party weapon.
   */
  id: number;

  ascension: Ascension;

  level: number;
}
