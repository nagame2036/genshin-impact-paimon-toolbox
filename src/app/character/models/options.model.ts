import {Rarity} from '../../game-common/models/rarity.type';
import {ElementType} from '../../game-common/models/element-type.enum';
import {WeaponType} from '../../weapon/models/weapon-type.enum';
import {Gender} from './gender.enum';

export interface CharacterInfoOptions {
  travelerGender: Gender;
}

export const defaultCharacterInfoOptions: CharacterInfoOptions = {
  travelerGender: Gender.FEMALE,
};

export interface CharacterViewOptions {
  sort: string[];
  infoSort: string[];
  rarities: Rarity[];
  elements: ElementType[];
  weapons: WeaponType[];
}
