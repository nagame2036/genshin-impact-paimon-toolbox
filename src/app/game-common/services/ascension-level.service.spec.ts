import {TestBed} from '@angular/core/testing';

import {AscensionLevelService} from './ascension-level.service';
import {AscensionLevel} from '../models/ascension-level.model';
import {GameCommonModule} from '../game-common.module';
import {AppTestingModule} from '../../app-testing.module';

describe('AscensionLevelService', () => {
  let service: AscensionLevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GameCommonModule, AppTestingModule],
    });
    service = TestBed.inject(AscensionLevelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should correct level', () => {
    const curr: AscensionLevel = {ascension: 2, level: 30};
    const data = service.correct(curr);
    expect(data.ascensionRange).toEqual([0, 6]);
    expect(data.ascension).toBe(2);
    expect(data.levelRange).toEqual([40, 50]);
    expect(data.level).toBe(40);
  });

  it('should correct plan level', () => {
    const plan: AscensionLevel = {ascension: 0, level: 1};
    const curr: AscensionLevel = {ascension: 2, level: 50};
    const data = service.correct(plan, curr);
    expect(data.ascensionRange).toEqual([2, 6]);
    expect(data.ascension).toBe(2);
    expect(data.levelRange).toEqual([50, 50]);
    expect(data.level).toBe(50);
  });
});
