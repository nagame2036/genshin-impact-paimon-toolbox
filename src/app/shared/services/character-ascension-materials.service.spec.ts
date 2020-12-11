import {TestBed} from '@angular/core/testing';

import {CharacterAscensionMaterialsService} from './character-ascension-materials.service';

describe('CharacterAscensionMaterialsService', () => {
  let service: CharacterAscensionMaterialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterAscensionMaterialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
