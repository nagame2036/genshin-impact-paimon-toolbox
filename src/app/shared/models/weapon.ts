import {WeaponType} from './weapon-type.enum';
import {Rarity} from './rarity.enum';

export interface Weapon {

  id: number;

  type: WeaponType;

  rarity: Rarity;

  domain: number;

  elite: number;

  common: number;
}
