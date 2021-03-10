import {WeaponType} from './weapon-type.enum';
import {Rarity} from '../../game-common/models/rarity.type';
import {ExpBonus} from '../../game-common/models/levelup-exp-bonus.model';
import {WeaponStatsInfo} from './weapon-stats.model';

export const allWeaponRarities: Rarity[] = [5, 4, 3];

/**
 * Represents the game data info of a weapon.
 */
export interface WeaponInfo {
  id: number;

  type: WeaponType;

  rarity: Rarity;

  materials: WeaponMaterialRequirement;

  /**
   * Exp bonus when weapon level-up.
   */
  expBonus?: ExpBonus[];

  stats: WeaponStatsInfo;
}

/**
 * Represents the material requirement for weapon leveling up.
 */
export interface WeaponMaterialRequirement {
  /**
   * Domain material group id.
   */
  domain: number;

  /**
   * Elite enemy drop material group id.
   */
  elite: number;

  /**
   * Mob enemy drop material group id.
   */
  mob: number;
}
