import {TestBed} from '@angular/core/testing';

import {TalentInfoService} from './talent-info.service';
import {CharacterModule} from '../character.module';
import {AppTestingModule} from '../../app-testing.module';

describe('TalentInfoService', () => {
  let service: TalentInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CharacterModule,
        AppTestingModule,
      ]
    });
    service = TestBed.inject(TalentInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
