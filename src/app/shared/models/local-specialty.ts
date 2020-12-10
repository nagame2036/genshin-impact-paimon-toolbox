import {Nation} from './nation.enum';

export interface LocalSpecialtiesData {

  groups: { [id: number]: LocalSpecialtyGroup };

  items: { [id: number]: LocalSpecialtyItem };
}

export interface LocalSpecialtyItem {

  group: number;
}

export interface LocalSpecialtyGroup {

  nation: Nation;
}
