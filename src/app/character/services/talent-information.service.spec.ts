import {TestBed} from '@angular/core/testing';

import {TalentInformationService} from './talent-information.service';
import {CharacterModule} from '../character.module';
import {AppTestingModule} from '../../app-testing.module';

describe('TalentInformationService', () => {
  let service: TalentInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CharacterModule,
        AppTestingModule,
      ]
    });
    service = TestBed.inject(TalentInformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
