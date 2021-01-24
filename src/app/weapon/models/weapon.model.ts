import {WeaponType} from './weapon-type.enum';
import {Rarity} from '../../shared/models/rarity.type';
import {ExpBonus} from '../../game-common/models/levelup-exp-bonus.model';

export interface Weapon {

  id: number;

  type: WeaponType;

  rarity: Rarity;

  domain: number;

  /**
   * Elite enemies material group used by weapon level-up.
   */
  elite: number;

  /**
   * Mob enemies material group used by weapon level-up.
   */
  mob: number;

  /**
   * Exp bonus when weapon level-up.
   */
  expBonus?: ExpBonus[];
}
