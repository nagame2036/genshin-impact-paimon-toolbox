import {TestBed} from '@angular/core/testing';

import {WeaponPlanner} from './weapon-planner.service';
import {WeaponModule} from '../weapon.module';
import {AppTestingModule} from '../../app-testing.module';

describe('WeaponPlanner', () => {
  let service: WeaponPlanner;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WeaponModule, AppTestingModule],
    });
    service = TestBed.inject(WeaponPlanner);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
