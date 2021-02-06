import {Nation} from '../../game-common/models/nation.enum';
import {MaterialInfo} from './material.model';

export interface TalentLevelupMaterial {

  groups: TalentLevelupMaterialGroup[];

  items: TalentLevelupMaterialItem[];
}

export interface TalentLevelupMaterialGroup {

  id: number;

  nation?: Nation;

  weekday?: number;
}

export interface TalentLevelupMaterialItem extends MaterialInfo {

  group: number;
}
