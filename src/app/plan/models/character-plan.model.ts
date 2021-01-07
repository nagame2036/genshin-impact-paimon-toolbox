import {Ascension} from '../../character-and-gear/models/ascension.enum';
import {TalentLevelData} from '../../character-and-gear/models/talent-level-data.model';

export interface CharacterPlan {

  /**
   * Id of party character.
   */
  id: number;

  ascension: Ascension;

  level: number;

  talents: TalentLevelData[];
}
