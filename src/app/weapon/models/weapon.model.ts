import {WeaponType} from './weapon-type.enum';
import {Rarity} from '../../game-common/models/rarity.type';
import {ExpBonus} from '../../game-common/models/levelup-exp-bonus.model';
import {WeaponAttribute} from './weapon-attribute.type';

export interface Weapon {

  id: number;

  type: WeaponType;

  rarity: Rarity;

  /**
   * Domain material group used by weapon level-up.
   */
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

  /**
   * Base ATK value.
   */
  atkBase: number;

  /**
   * ATK value grow curve type.
   */
  atkCurve: number;

  /**
   * 2nd stat type.
   */
  subStatType: WeaponAttribute;

  /**
   * 2nd stat base value.
   */
  subStatBase: number;

  /**
   * 2nd stat value grow curve type.
   */
  subStatCurve: number;
}
