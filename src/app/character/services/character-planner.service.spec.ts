import {TestBed} from '@angular/core/testing';

import {CharacterPlanner} from './character-planner.service';
import {CharacterModule} from '../character.module';
import {AppTestingModule} from '../../app-testing.module';

describe('CharacterPlanner', () => {
  let service: CharacterPlanner;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CharacterModule, AppTestingModule],
    });
    service = TestBed.inject(CharacterPlanner);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
