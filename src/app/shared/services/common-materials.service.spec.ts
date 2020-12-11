import {TestBed} from '@angular/core/testing';

import {CommonMaterialsService} from './common-materials.service';

describe('CommonMaterialsService', () => {
  let service: CommonMaterialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonMaterialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
