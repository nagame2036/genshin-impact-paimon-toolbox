import {Rarity} from './rarity.enum';
import {WeaponType} from './weapon-type.enum';
import {ElementType} from './element-type.enum';
import {Nation} from './nation.enum';

export interface Character {

  id: number;

  rarity: Rarity;

  element?: ElementType;

  weapon: WeaponType;

  nation?: Nation;

  elemental?: Nation;

  gem: number;

  common: number;

  local: number;
}
