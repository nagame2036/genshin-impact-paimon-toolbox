import {TestBed} from '@angular/core/testing';

import {getLevelupPlan, LevelupPlan, toAscensionLevel} from './levelup-plan.model';
import {LevelupPhase} from './levelup-phase.enum';
import {AscensionLevel} from '../../shared/models/ascension-level.model';
import {Ascension} from '../../shared/models/ascension.enum';

describe('LevelupPlan', () => {
  let plan: LevelupPlan;
  let level: AscensionLevel;

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('getLevelupPlan() should be correct', () => {
    plan = getLevelupPlan(0, 1);
    expect(plan.phase).toBe(LevelupPhase.ONE_TO_TWENTY);
    plan = getLevelupPlan(0, 10);
    expect(plan.phase).toBe(LevelupPhase.ONE_TO_TWENTY);
    plan = getLevelupPlan(0, 20);
    expect(plan.phase).toBe(LevelupPhase.ONE_TO_TWENTY);

    plan = getLevelupPlan(1, 20);
    expect(plan.phase).toBe(LevelupPhase.ASCENSION_1);

    plan = getLevelupPlan(1, 30);
    expect(plan.phase).toBe(LevelupPhase.TWENTY_TO_FORTY);
    plan = getLevelupPlan(1, 40);
    expect(plan.phase).toBe(LevelupPhase.TWENTY_TO_FORTY);

    plan = getLevelupPlan(2, 40);
    expect(plan.phase).toBe(LevelupPhase.ASCENSION_2);

    plan = getLevelupPlan(2, 45);
    expect(plan.phase).toBe(LevelupPhase.FORTY_TO_FIFTY);
    plan = getLevelupPlan(2, 50);
    expect(plan.phase).toBe(LevelupPhase.FORTY_TO_FIFTY);

    plan = getLevelupPlan(3, 50);
    expect(plan.phase).toBe(LevelupPhase.ASCENSION_3);

    plan = getLevelupPlan(3, 55);
    expect(plan.phase).toBe(LevelupPhase.FIFTY_TO_SIXTY);
    plan = getLevelupPlan(3, 60);
    expect(plan.phase).toBe(LevelupPhase.FIFTY_TO_SIXTY);

    plan = getLevelupPlan(4, 60);
    expect(plan.phase).toBe(LevelupPhase.ASCENSION_4);

    plan = getLevelupPlan(4, 65);
    expect(plan.phase).toBe(LevelupPhase.SIXTY_TO_SEVENTY);
    plan = getLevelupPlan(4, 70);
    expect(plan.phase).toBe(LevelupPhase.SIXTY_TO_SEVENTY);

    plan = getLevelupPlan(5, 70);
    expect(plan.phase).toBe(LevelupPhase.ASCENSION_5);

    plan = getLevelupPlan(5, 75);
    expect(plan.phase).toBe(LevelupPhase.SEVENTY_TO_EIGHTY);
    plan = getLevelupPlan(5, 80);
    expect(plan.phase).toBe(LevelupPhase.SEVENTY_TO_EIGHTY);

    plan = getLevelupPlan(6, 80);
    expect(plan.phase).toBe(LevelupPhase.ASCENSION_6);

    plan = getLevelupPlan(6, 85);
    expect(plan.phase).toBe(LevelupPhase.EIGHTY_TO_NINETY);
    plan = getLevelupPlan(6, 90);
    expect(plan.phase).toBe(LevelupPhase.EIGHTY_TO_NINETY);
  });

  it('toAscensionLevel() should be correct', () => {
    level = toAscensionLevel(getLevelupPlan(0, 1));
    expect(level.ascension).toBe(Ascension.ZERO);
    level = toAscensionLevel(getLevelupPlan(0, 10));
    expect(level.ascension).toBe(Ascension.ZERO);
    level = toAscensionLevel(getLevelupPlan(0, 20));
    expect(level.ascension).toBe(Ascension.ZERO);

    level = toAscensionLevel(getLevelupPlan(1, 20));
    expect(level.ascension).toBe(Ascension.ONE);
    level = toAscensionLevel(getLevelupPlan(1, 30));
    expect(level.ascension).toBe(Ascension.ONE);
    level = toAscensionLevel(getLevelupPlan(1, 40));
    expect(level.ascension).toBe(Ascension.ONE);

    level = toAscensionLevel(getLevelupPlan(2, 40));
    expect(level.ascension).toBe(Ascension.TWO);
    level = toAscensionLevel(getLevelupPlan(2, 45));
    expect(level.ascension).toBe(Ascension.TWO);
    level = toAscensionLevel(getLevelupPlan(2, 50));
    expect(level.ascension).toBe(Ascension.TWO);

    level = toAscensionLevel(getLevelupPlan(3, 50));
    expect(level.ascension).toBe(Ascension.THREE);
    level = toAscensionLevel(getLevelupPlan(3, 55));
    expect(level.ascension).toBe(Ascension.THREE);
    level = toAscensionLevel(getLevelupPlan(3, 60));
    expect(level.ascension).toBe(Ascension.THREE);

    level = toAscensionLevel(getLevelupPlan(4, 60));
    expect(level.ascension).toBe(Ascension.FOUR);
    level = toAscensionLevel(getLevelupPlan(4, 65));
    expect(level.ascension).toBe(Ascension.FOUR);
    level = toAscensionLevel(getLevelupPlan(4, 70));
    expect(level.ascension).toBe(Ascension.FOUR);

    level = toAscensionLevel(getLevelupPlan(5, 70));
    expect(level.ascension).toBe(Ascension.FIVE);
    level = toAscensionLevel(getLevelupPlan(5, 75));
    expect(level.ascension).toBe(Ascension.FIVE);
    level = toAscensionLevel(getLevelupPlan(5, 80));
    expect(level.ascension).toBe(Ascension.FIVE);

    level = toAscensionLevel(getLevelupPlan(6, 80));
    expect(level.ascension).toBe(Ascension.SIX);
    level = toAscensionLevel(getLevelupPlan(6, 85));
    expect(level.ascension).toBe(Ascension.SIX);
    level = toAscensionLevel(getLevelupPlan(6, 90));
    expect(level.ascension).toBe(Ascension.SIX);
  });
});
