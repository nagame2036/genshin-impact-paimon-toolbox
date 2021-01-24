import {TestBed} from '@angular/core/testing';

import {WeaponPlanner} from './weapon-planner.service';
import {WeaponModule} from '../weapon.module';
import {HttpClientModule} from '@angular/common/http';
import {AppIndexedDbModule} from '../../app-indexed-db.module';
import {AppTranslateModule} from '../../app-translate.module';

describe('WeaponPlanner', () => {
  let service: WeaponPlanner;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        WeaponModule,
        HttpClientModule,
        AppTranslateModule,
        AppIndexedDbModule
      ]
    });
    service = TestBed.inject(WeaponPlanner);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
