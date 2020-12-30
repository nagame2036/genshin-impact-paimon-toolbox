import {TalentLevel} from '../../character-and-gear/models/talent-level.type';

export interface TalentPlan {

  id: number;

  start: TalentLevel;

  goal: TalentLevel;
}
