import {Nation} from '../nation.enum';

export interface LocalSpecialty {

  groups: LocalSpecialtyGroup[];

  items: LocalSpecialtyItem[];
}

export interface LocalSpecialtyGroup {

  id: number;

  nation: Nation;
}

export interface LocalSpecialtyItem {

  id: number;

  group: number;
}
