import {LevelupPhase} from './levelup-phase.enum';
import {Ascension} from '../../character-and-gear/models/ascension.enum';
import {AscensionLevel} from '../../character-and-gear/models/ascension-level.model';

export interface LevelupPlan {

  phase: LevelupPhase;

  level: number;
}

export function getLevelupPlan(ascension: Ascension, level: number): LevelupPlan {
  let phase: LevelupPhase;
  if (ascension < Ascension.THREE) {
    phase = Math.floor(level * .0499) + ascension;
  } else {
    phase = Math.floor(level * .0999) + ascension - 2;
  }
  return {phase, level};
}

export function toAscensionLevel(plan: LevelupPlan): AscensionLevel {
  const ascension = Math.floor((plan.phase + 1) * .5);
  return new AscensionLevel(ascension, plan.level);
}
