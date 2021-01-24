import {TalentLevel} from './talent-level.type';

export interface TalentPlan {

  id: number;

  start: TalentLevel;

  goal: TalentLevel;
}
