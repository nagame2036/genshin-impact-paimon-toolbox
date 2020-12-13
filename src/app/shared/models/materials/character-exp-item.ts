import {Rarity} from '../rarity.enum';

export interface CharacterExpItemsData {

  groups: CharacterExpGroup[];

  items: CharacterExpItem[];
}

export interface CharacterExpGroup {

  id: number;
}

export interface CharacterExpItem {

  id: number;

  rarity: Rarity;

  exp: number;
}
