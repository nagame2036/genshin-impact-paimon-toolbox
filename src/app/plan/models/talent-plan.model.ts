import {TalentLevel} from '../../character-and-gear/models/talent-level.type';

export interface TalentPlan {

  id: number;

  from: TalentLevel;

  to: TalentLevel;
}
