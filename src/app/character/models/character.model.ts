import {Rarity} from '../../shared/models/rarity.type';
import {WeaponType} from '../../weapon/models/weapon-type.enum';
import {ElementType} from '../../shared/models/element-type.enum';
import {Nation} from '../../shared/models/nation.enum';
import {ExpBonus} from '../../game-common/models/levelup-exp-bonus.model';

export interface Character {

  id: number;

  rarity: Rarity;

  element: ElementType;

  weapon: WeaponType;

  nation?: Nation;

  /**
   * Talent ids.
   */
  skills: number[];

  boss?: number;

  gem: number;

  mob: number;

  local: number;

  expBonus?: ExpBonus[];
}
