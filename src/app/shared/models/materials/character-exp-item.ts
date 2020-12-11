import {Rarity} from '../rarity.enum';

export interface CharacterExpItemsData {

  groups: { [id: number]: CharacterExpGroup };

  items: { [id: number]: CharacterExpItem };
}

// tslint:disable-next-line:no-empty-interface
export interface CharacterExpGroup {
}

export interface CharacterExpItem {

  rarity: Rarity;

  exp: number;
}
