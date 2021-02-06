import {TestBed} from '@angular/core/testing';

import {CharacterInfoService} from './character-info.service';
import {CharacterModule} from '../character.module';
import {AppTestingModule} from '../../app-testing.module';

describe('CharacterInfoService', () => {
  let service: CharacterInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CharacterModule,
        AppTestingModule,
      ]
    });
    service = TestBed.inject(CharacterInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
