import {Rarity} from '../../game-common/models/rarity.type';
import {WeaponType} from './weapon-type.enum';

export interface WeaponViewOptions {
  sort: string[];
  infoSort: string[];
  rarities: Rarity[];
  types: WeaponType[];
}
