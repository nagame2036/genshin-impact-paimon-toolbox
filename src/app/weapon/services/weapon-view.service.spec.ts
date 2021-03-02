import {TestBed} from '@angular/core/testing';

import {WeaponViewService} from './weapon-view.service';
import {WeaponModule} from '../weapon.module';
import {AppTestingModule} from '../../app-testing.module';

describe('WeaponViewService', () => {
  let service: WeaponViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WeaponModule, AppTestingModule],
    });
    service = TestBed.inject(WeaponViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
