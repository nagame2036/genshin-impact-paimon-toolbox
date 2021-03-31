import {Ascension} from '../../game-common/models/ascension.type';
import {ItemPlan} from '../../game-common/models/item.model';
import {Weapon} from './weapon.model';

/**
 * Represents the levelup goal of a weapon.
 */
export interface WeaponPlan extends ItemPlan<Weapon> {
  id: number;

  weaponId: number;

  ascension: Ascension;

  level: number;
}
