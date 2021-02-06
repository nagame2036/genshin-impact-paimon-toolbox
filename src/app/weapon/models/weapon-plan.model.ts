import {Ascension} from '../../game-common/models/ascension.type';

/**
 * Represents the levelup goal of a weapon.
 */
export interface WeaponPlan {

  id: number;

  weaponId: number;

  ascension: Ascension;

  level: number;
}
