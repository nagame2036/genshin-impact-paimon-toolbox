import {TestBed} from '@angular/core/testing';

import {WeaponService} from './weapon.service';
import {WeaponModule} from '../weapon.module';
import {AppTestingModule} from '../../app-testing.module';

describe('WeaponService', () => {
  let service: WeaponService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WeaponModule, AppTestingModule],
    });
    service = TestBed.inject(WeaponService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
