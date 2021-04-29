import {Rarity} from '../../game-common/models/rarity.type';
import {WeaponType} from '../../weapon/models/weapon-type.type';
import {ElementType} from '../../game-common/models/element-type.type';
import {Nation} from '../../game-common/models/nation.enum';
import {CharacterStatsCurveAscension, CharacterStatsInfo} from './character-stats.model';
import {ItemInfo} from '../../game-common/models/item.model';
import {Character} from './character.model';

export const allCharacterRarities: Rarity[] = [5, 4];

/**
 * Represents the game data info of a character.
 */
export interface CharacterInfo extends ItemInfo<Character> {
  rarity: Rarity;

  weapon: WeaponType;

  element: ElementType;

  nation?: Nation;

  talents: number[];

  materials: CharacterMaterialRequirement;

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
