import {Rarity} from '../../game-common/models/rarity.type';
import {ElementType} from '../../game-common/models/element-type.type';
import {WeaponType} from '../../weapon/models/weapon-type.type';
import {Gender} from './gender.enum';
import {ItemViewOptions} from '../../game-common/models/item-view-options.model';

export interface CharacterInfoOptions {
  travelerGender: Gender;
}

export interface CharacterViewOptions extends ItemViewOptions {
  rarities: Rarity[];
  elements: ElementType[];
  weapons: WeaponType[];
}
