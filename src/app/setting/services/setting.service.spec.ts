import {TestBed} from '@angular/core/testing';

import {SettingService} from './setting.service';
import {AppTestingModule} from '../../app-testing.module';

describe('SettingService', () => {
  let service: SettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
    });
    service = TestBed.inject(SettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
