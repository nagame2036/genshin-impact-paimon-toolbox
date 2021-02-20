import {TestBed} from '@angular/core/testing';

import {CharacterViewService} from './character-view.service';
import {CharacterModule} from '../character.module';
import {AppTestingModule} from '../../app-testing.module';

describe('CharacterViewService', () => {
  let service: CharacterViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CharacterModule,
        AppTestingModule,
      ]
    });
    service = TestBed.inject(CharacterViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
