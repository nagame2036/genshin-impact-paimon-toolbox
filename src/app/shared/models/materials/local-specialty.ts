import {Nation} from '../nation.enum';

export interface LocalSpecialtiesData {

  groups: LocalSpecialtyGroup[];

  items: LocalSpecialtyItem[];
}

export interface LocalSpecialtyItem {

  id: number;

  group: number;
}

export interface LocalSpecialtyGroup {

  id: number;

  nation: Nation;
}
