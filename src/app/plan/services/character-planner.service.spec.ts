import {TestBed} from '@angular/core/testing';

import {CharacterPlanner} from './character-planner.service';
import {PlanModule} from '../plan.module';
import {AppIndexedDbModule} from '../../app-indexed-db.module';
import {HttpClientModule} from '@angular/common/http';
import {AppTranslateModule} from '../../app-translate.module';

describe('CharacterPlanner', () => {
  let service: CharacterPlanner;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        PlanModule,
        HttpClientModule,
        AppIndexedDbModule,
        AppTranslateModule,
      ]
    });
    service = TestBed.inject(CharacterPlanner);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
