import {TestBed} from '@angular/core/testing';

import {CharacterStatProfileService} from './character-stat-profile.service';

describe('CharacterStatProfileService', () => {
  let service: CharacterStatProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterStatProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
