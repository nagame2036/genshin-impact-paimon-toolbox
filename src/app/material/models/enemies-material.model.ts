import {MaterialInfo} from './material.model';

export interface EnemiesMaterial {
  groups: EnemiesMaterialGroup[];

  items: EnemiesMaterialItem[];
}

export interface EnemiesMaterialGroup {
  id: number;
}

export interface EnemiesMaterialItem extends MaterialInfo {
  group: number;
}
