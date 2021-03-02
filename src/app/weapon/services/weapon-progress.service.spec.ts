import {TestBed} from '@angular/core/testing';

import {WeaponProgressService} from './weapon-progress.service';
import {WeaponModule} from '../weapon.module';
import {AppTestingModule} from '../../app-testing.module';

describe('WeaponProgressService', () => {
  let service: WeaponProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WeaponModule, AppTestingModule],
    });
    service = TestBed.inject(WeaponProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
