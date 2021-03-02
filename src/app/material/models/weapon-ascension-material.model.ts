import {Nation} from '../../game-common/models/nation.enum';
import {MaterialInfo} from './material.model';

export interface WeaponAscensionMaterial {
  groups: WeaponAscensionMaterialGroup[];

  items: WeaponAscensionMaterialItem[];
}

export interface WeaponAscensionMaterialGroup {
  id: number;

  nation: Nation;

  weekday: number;
}

export interface WeaponAscensionMaterialItem extends MaterialInfo {
  group: number;
}
