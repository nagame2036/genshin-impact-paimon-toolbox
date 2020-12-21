import {LevelupPlan} from './levelup-plan.model';
import {TalentLevelData} from '../../character-and-gear/models/talent-level-data.model';

export interface CharacterPlan {

  /**
   * Id of party character.
   */
  id: number;

  levelup: LevelupPlan;

  talents: TalentLevelData[];
}
