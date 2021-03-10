import {Rarity} from '../../game-common/models/rarity.type';
import {WeaponType} from '../../weapon/models/weapon-type.enum';
import {ElementType} from '../../game-common/models/element-type.enum';
import {Nation} from '../../game-common/models/nation.enum';
import {ExpBonus} from '../../game-common/models/levelup-exp-bonus.model';
import {
  CharacterStatsCurveAscension,
  CharacterStatsInfo,
} from './character-stats.model';

export const allCharacterRarities: Rarity[] = [5, 4];

/**
 * Represents the game data info of a character.
 */
export interface CharacterInfo {
  id: number;

  rarity: Rarity;

  weapon: WeaponType;

  element: ElementType;

  nation?: Nation;

  /**
   * Character talents ids which is level upgradable.
   */
  talentsUpgradable: number[];

  /**
   * Character talents ids which isn't level upgradable.
   */
  talentsOther: number[];

  materials: CharacterMaterialRequirement;

  expBonus?: ExpBonus[];

  stats: CharacterStatsInfo;

  curvesAscension: CharacterStatsCurveAscension;
}

/**
 * Represents the material requirement for character leveling up.
 */
export interface CharacterMaterialRequirement {
  /**
   * Boss material id.
   */
  boss?: number;

  /**
   * Elemental gem material group id.
   */
  gem: number;

  /**
   * Mob enemy drop material group id.
   */
  mob: number;

  /**
   * Local specialty material id.
   */
  local: number;
}
