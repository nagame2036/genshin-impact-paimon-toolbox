import {Rarity} from '../../game-common/models/rarity.type';
import {WeaponType} from './weapon-type.type';
import {ItemViewOptions} from '../../game-common/models/item-view-options.model';

export interface WeaponViewOptions extends ItemViewOptions {
  rarities: Rarity[];
  types: WeaponType[];
}
