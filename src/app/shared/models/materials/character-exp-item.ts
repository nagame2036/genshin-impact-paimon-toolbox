import {Rarity} from '../rarity.enum';

export interface CharacterExpItemsData {

  [id: number]: CharacterExpItem;
}

export interface CharacterExpItem {

  rarity: Rarity;

  exp: number;
}
