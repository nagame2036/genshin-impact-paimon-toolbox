import {Ascension} from '../../character-and-gear/models/ascension.type';
import {TalentLevelData} from '../../character/models/talent-level-data.model';

export interface CharacterPlan {

  /**
   * Id of party character.
   */
  id: number;

  ascension: Ascension;

  level: number;

  talents: TalentLevelData[];
}
