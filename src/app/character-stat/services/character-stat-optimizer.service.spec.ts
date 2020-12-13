import {TestBed} from '@angular/core/testing';

import {CharacterStatOptimizerService} from './character-stat-optimizer.service';

describe('CharacterStatOptimizerService', () => {
  let service: CharacterStatOptimizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterStatOptimizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('optimize for common use', () => {
    const optimized = service.optimize(969, 311, 1.78);
    expect(optimized.atk).toBeCloseTo(0.8082, 4);
    expect(optimized.critRate).toBeCloseTo(0.7206, 4);
    expect(optimized.critDmg).toBeCloseTo(1.0412, 4);
  });

  it('optimize for all stat points should added to ATK', () => {
    const optimized = service.optimize(969, 311, 1.28);
    expect(optimized.atk).toBeCloseTo(1.92, 4);
    expect(optimized.critRate).toBeCloseTo(0, 4);
    expect(optimized.critDmg).toBeCloseTo(0, 4);
  });

  it('optimize for CRIT Rate 100%, equivalent to 85 points added to CRIT Rate', () => {
    const optimized = service.optimize(969, 311, 2.68);
    expect(optimized.atk).toBeCloseTo(1.1996, 4);
    expect(optimized.critRate).toBeCloseTo(0.95, 4);
    expect(optimized.critDmg).toBeCloseTo(1.8606, 4);
  });
});
