import {MaterialInfo} from './material.model';

export interface CharacterAscensionMaterial {

  groups: CharacterAscensionMaterialGroup[];

  items: CharacterAscensionMaterialItem[];
}

export interface CharacterAscensionMaterialGroup {

  id: number;
}

export interface CharacterAscensionMaterialItem extends MaterialInfo {

  group: number;
}
