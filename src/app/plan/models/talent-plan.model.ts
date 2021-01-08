import {TalentLevel} from '../../character/models/talent-level.type';

export interface TalentPlan {

  id: number;

  start: TalentLevel;

  goal: TalentLevel;
}
