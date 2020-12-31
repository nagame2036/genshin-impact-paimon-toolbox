import {Ascension} from '../../character-and-gear/models/ascension.enum';
import {TalentLevelData} from '../../character-and-gear/models/talent-level-data.model';

export interface CharacterPlanDetail {

  id: number;

  ascension: Ascension;

  level: number;

  talents: TalentLevelData[];
}
