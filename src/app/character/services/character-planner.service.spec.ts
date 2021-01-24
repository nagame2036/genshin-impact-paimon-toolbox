import {TestBed} from '@angular/core/testing';

import {CharacterPlanner} from './character-planner.service';
import {CharacterModule} from '../character.module';
import {AppIndexedDbModule} from '../../app-indexed-db.module';
import {HttpClientModule} from '@angular/common/http';
import {AppTranslateModule} from '../../app-translate.module';

describe('CharacterPlanner', () => {
  let service: CharacterPlanner;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CharacterModule,
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
