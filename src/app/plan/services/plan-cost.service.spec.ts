import {TestBed} from '@angular/core/testing';

import {PlanCostService} from './plan-cost.service';
import {PlanModule} from '../plan.module';
import {AppIndexedDbModule} from '../../app-indexed-db.module';
import {HttpClientModule} from '@angular/common/http';

describe('PlanCostService', () => {
  let service: PlanCostService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        PlanModule,
        AppIndexedDbModule,
        HttpClientModule
      ]
    });
    service = TestBed.inject(PlanCostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
