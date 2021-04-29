import {WeaponType} from './weapon-type.type';
import {Rarity} from '../../game-common/models/rarity.type';
import {WeaponStatsInfo} from './weapon-stats.model';
import {WeaponAbility} from './weapon-ability.model';
import {ItemInfo} from '../../game-common/models/item.model';
import {Weapon} from './weapon.model';

export const allWeaponRarities: Rarity[] = [5, 4, 3];

/**
 * Represents the game data info of a weapon.
 */
export interface WeaponInfo extends ItemInfo<Weapon> {
  id: number;

  type: WeaponType;

  rarity: Rarity;

  materials: WeaponMaterialRequirement;

  stats: WeaponStatsInfo;

  ability: WeaponAbility;
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
