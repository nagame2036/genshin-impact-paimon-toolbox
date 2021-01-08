import {WeaponType} from './weapon-type.enum';
import {Rarity} from '../../shared/models/rarity.enum';
import {ExpBonus} from '../../character-and-gear/models/levelup-exp-bonus.model';

export interface Weapon {

  id: number;

  type: WeaponType;

  rarity: Rarity;

  domain: number;

  elite: number;

  common: number;

  expBonus?: ExpBonus[];
}
