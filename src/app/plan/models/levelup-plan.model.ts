import {LevelupPhase} from './levelup-phase.enum';
import {Ascension} from '../../shared/models/ascension.enum';
import {AscensionLevel} from '../../shared/models/ascension-level.model';

export interface LevelupPlan {

  phase: LevelupPhase;

  level: number;
}

export function getLevelupPlan(ascension: Ascension, level: number): LevelupPlan {
  let phase: LevelupPhase;
  if (ascension < Ascension.THREE) {
    phase = Math.floor(level / 20.1) + ascension;
  } else {
    phase = Math.floor(level / 10.1) + ascension - 2;
  }
  return {phase, level};
}

export function toAscensionLevel(plan: LevelupPlan): AscensionLevel {
  const ascension = Math.floor((plan.phase + 1) / 2);
  return new AscensionLevel(ascension, plan.level);
}
