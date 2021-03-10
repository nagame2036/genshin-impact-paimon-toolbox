import {Rarity} from '../../game-common/models/rarity.type';
import {ElementType} from '../../game-common/models/element-type.enum';
import {WeaponType} from '../../weapon/models/weapon-type.enum';

export interface CharacterViewOptions {
  sort: string[];
  infoSort: string[];
  rarities: Rarity[];
  elements: ElementType[];
  weapons: WeaponType[];
}
