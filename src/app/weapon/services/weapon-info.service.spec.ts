import {TestBed} from '@angular/core/testing';

import {WeaponInfoService} from './weapon-info.service';
import {Weapon} from '../models/weapon.model';
import {WeaponType} from '../models/weapon-type.enum';
import {WeaponModule} from '../weapon.module';
import {AppTestingModule} from '../../app-testing.module';

describe('WeaponInfoService', () => {
  let service: WeaponInfoService;
  let weapon: Weapon;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WeaponModule, AppTestingModule],
    });
    service = TestBed.inject(WeaponInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('calculate weapon stats', done => {
    weapon = {
      info: {
        id: 15502,
        type: WeaponType.BOW,
        rarity: 5,
        materials: {
          domain: 402,
          elite: 902,
          mob: 800,
        },
        stats: {
          'ATK Base': {
            initial: 45.9364013671875,
            curve: 'ATK-301',
          },
          'ATK%': {
            initial: 0.1080000028014183,
            curve: 'CHC-301',
          },
        },
      },
      progress: {
        id: 1,
        weaponId: 15502,
        refine: 1,
        ascension: 6,
        level: 90,
      },
      plan: {
        id: 1,
        weaponId: 15502,
        ascension: 6,
        level: 90,
      },
    };
    service.getStatsValue(weapon.info, weapon.progress).subscribe(stats => {
      expect(stats.get('ATK Base')).toBeCloseTo(608, 0);
      expect(stats.get('ATK%')).toBeCloseTo(0.496, 3);
      done();
    });
  });
});
