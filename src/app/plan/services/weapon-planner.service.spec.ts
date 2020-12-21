import {TestBed} from '@angular/core/testing';

import {WeaponPlanner} from './weapon-planner.service';
import {PlanModule} from '../plan.module';
import {HttpClientModule} from '@angular/common/http';
import {AppIndexedDbModule} from '../../app-indexed-db.module';

describe('WeaponPlanner', () => {
  let service: WeaponPlanner;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        PlanModule,
        HttpClientModule,
        AppIndexedDbModule
      ]
    });
    service = TestBed.inject(WeaponPlanner);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
