import {Rarity} from '../rarity.enum';

export interface CharacterExpMaterial {

  groups: CharacterExpMaterialGroup[];

  items: CharacterExpMaterialItem[];
}

export interface CharacterExpMaterialGroup {

  id: number;
}

export interface CharacterExpMaterialItem {

  id: number;

  rarity: Rarity;

  exp: number;
}
