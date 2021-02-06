import {Nation} from '../../game-common/models/nation.enum';
import {MaterialInfo} from './material.model';

export interface LocalSpecialty {

  groups: LocalSpecialtyGroup[];

  items: LocalSpecialtyItem[];
}

export interface LocalSpecialtyGroup {

  id: number;

  nation: Nation;
}

export interface LocalSpecialtyItem extends MaterialInfo {

  group: number;
}
