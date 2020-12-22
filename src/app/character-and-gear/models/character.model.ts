import {Rarity} from '../../shared/models/rarity.enum';
import {WeaponType} from './weapon-type.enum';
import {ElementType} from '../../shared/models/element-type.enum';
import {Nation} from '../../shared/models/nation.enum';

export interface Character {

  id: number;

  rarity: Rarity;

  element: ElementType;

  weapon: WeaponType;

  nation?: Nation;

  elemental?: number;

  gem: number;

  common: number;

  local: number;
}
